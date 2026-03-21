import { addMonths, isAfter } from "date-fns";
import { v4 as uuid } from "uuid";

import { ITransactionManager } from "@/core/domain/ports/ITransactionManager.interface";
import { IEmailSender } from "@/features/auth/domain/ports/IEmailSender.interface";

import { ProductDetails, SubscriptionHistory } from "../../domain/types";
import { Subscription } from "../../domain/entities";
import {
  PaymentGatewayRepository,
  SubscriptionRepository,
} from "../../domain/repositories";

import { UsersFeature } from "@/features/users";

/**
 * Caso de uso encargado de renovar suscripciones activas que han expirado.
 *
 * Típicamente ejecutado como una tarea programada (cron). Por cada suscripción:
 * - Verifica si está expirada.
 * - Crea una nueva orden en el gateway de pago usando la referencia del cliente.
 * - Captura el pago.
 * - Actualiza el historial marcando períodos viejos como inactivos y agregando
 *   un nuevo período activo.
 *
 * Procesa cada suscripción de forma aislada, registrando errores sin detener
 * el procesamiento de las demás.
 *
 * @example
 * ```ts
 * const useCase = new RenewSubscriptionUseCase(subscriptionRepo, paymentRepo);
 * await useCase.run(); // Cron ejecuta esto regularmente
 * ```
 */
export class RenewSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly paymentGatewayRepository: PaymentGatewayRepository,
    private readonly transactionManager: ITransactionManager,
    private readonly emailSender: IEmailSender,
  ) {}

  /**
   * Método privado que maneja la lógica de renovación para una suscripción.
   *
   * @param subscription - la suscripción a renovar.
   * @param today - fecha actual para cálculos.
   * @private
   */
  private async renewSubscription(
    subscription: Subscription,
    today: Date,
  ): Promise<string | null> {
    // 1️. Verificar si está expirada usando únicamente el último periodo activo
    const lastHistoryItem = subscription.history.at(-1);
    if (!lastHistoryItem) return null;

    const endDate = new Date(lastHistoryItem.endDate);
    // si la fecha de fin todavía no ha pasado no hacemos nada
    if (!isAfter(today, endDate)) return null;

    // 3️. Cobrar en PayPal
    const productDetails: ProductDetails = {
      productId: lastHistoryItem.plan.subscriptionPlanId,
      title: lastHistoryItem.plan.title[subscription.language],
      description: lastHistoryItem.plan.description[subscription.language],
      price: lastHistoryItem.plan.price,
      productType: "subscription",
    };

    const { gatewayOrderId, status } =
      await this.paymentGatewayRepository.createOrderFromReference(
        productDetails,
        subscription.gatewayCustomerReference,
      );

    if (status !== "COMPLETED") {
      await this.paymentGatewayRepository.captureOrder(gatewayOrderId);
    }

    // 4️. Pago exitoso → construir y persistir el update en Mongo
    const historyId = uuid();

    // Marcar todo el historial previo como "inactive"
    const updatedHistory: SubscriptionHistory[] = subscription.history.map(
      (item) => ({ ...item, status: "inactive" }),
    );

    // Agregar nuevo periodo activo
    updatedHistory.push({
      historyId,
      plan: lastHistoryItem.plan,
      status: "active",
      startDate: today,
      endDate: addMonths(today, 1),
    });

    // 5️. Persistir solo esta suscripción con los cambios reales
    await this.subscriptionRepository.updateSubscriptions([
      {
        subscriptionId: subscription.subscriptionId,
        gatewayCustomerReference: subscription.gatewayCustomerReference,
        currentHistoryId: historyId,
        userId: subscription.userId,
        language: subscription.language,
        history: updatedHistory,
      },
    ]);

    return subscription.subscriptionId;
  }

  /**
   * Ejecuta la renovación de todas las suscripciones activas expiradas.
   *
   * Obtiene las suscripciones activas, intenta renovar cada una usando
   * `Promise.allSettled` para aislar fallos, y registra errores en la consola
   * para auditoría del cron.
   *
   * @remarks
   *   Cualquier fallo en una suscripción no afecta el procesamiento de otras.
   */
  async run(): Promise<string[]> {
    const today = new Date();

    const activeSubscriptions =
      await this.subscriptionRepository.findActiveSubscriptions();

    // filtramos enseguida los caducados para no iterar innecesariamente
    const toRenew = activeSubscriptions.filter((subscription) => {
      const last = subscription.history.at(-1);
      if (!last) return false;
      return isAfter(today, new Date(last.endDate));
    });

    //Variable para almacenar todos los ids de las subscripciones modificadas
    const subscriptionIds: string[] = [];

    // Procesamos cada suscripción de forma aislada
    // allSettled garantiza que un fallo no detiene el resto
    const results = await Promise.allSettled(
      toRenew.map(async (subscription) => {
        const id = await this.renewSubscription(subscription, today);
        if (id) subscriptionIds.push(id);
      }),
    );

    // Log de resultados para observabilidad del cron
    await Promise.allSettled(
      results.map(async (result, index) => {
        if (result.status === "rejected") {
          /** Si falla alguna renovación de suscripción desactivamos el estado premium 
         del usuario y ponemos como estado failed el hitorial actual para mostrar 
         al usuario que la auto renovación a fallado y enviamos un email notificando al usuario del error */
          if (toRenew[index]) {
            const { subscriptionId, currentHistoryId, userId } = toRenew[index];
            await this.transactionManager.execute(async (ctx) => {
              await this.subscriptionRepository.updateSubscriptionStatus(
                subscriptionId,
                currentHistoryId,
                "failed",
                ctx,
              );

              await UsersFeature.repository.updateAccountType(
                userId,
                false,
                ctx,
              );

              const user = await UsersFeature.repository.findById(userId);

              if (!user) return;

              await this.emailSender.sendEmail(
                "Error al renovar la suscripción de EduPrompt",
                [user.email],
                `<h1>Ha ocurrido un error en el pago de tu suscripción, puedes reintentar el pago desde 
                la app en la sección de configuraciones. Si el problema persiste comunicate con soporte</h1>`,
              );
            });
          }

          console.error(
            `Failed to renew subscription ${toRenew[index]?.subscriptionId}:`,
            result.reason,
          );
        }
      }),
    );
    return subscriptionIds;
  }
}
