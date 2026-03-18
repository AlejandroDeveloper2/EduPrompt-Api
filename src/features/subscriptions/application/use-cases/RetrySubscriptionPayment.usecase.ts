import { addMonths } from "date-fns";

import { ITransactionManager } from "@/core/domain/ports/ITransactionManager.interface";
import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { SubscriptionHistory } from "../../domain/types";

import {
  PaymentGatewayRepository,
  SubscriptionRepository,
} from "../../domain/repositories";

import { FindSubscriptionByIdUseCase } from "./FindSubscriptionById.usecase";

import { UsersFeature } from "@/features/users";

/**
 * Caso de uso para reintentar el cobro y reactivar una suscripción fallida o cancelada.
 *
 * Flujo general:
 * 1) Busca la suscripción por su ID.
 * 2) Obtiene el último ítem del historial de la suscripción.
 * 3) Captura el pago en el gateway con el orderId provisto.
 * 4) Si el pago es exitoso, actualiza el historial a "active", extiende un mes y
 *    reactiva el estado premium del usuario asociado (si existe).
 * 5) Todas las actualizaciones se realizan dentro de una transacción.
 */
export class RetrySubscriptionPaymentUseCase {
  private readonly findSubscriptionByIdUseCase: FindSubscriptionByIdUseCase;

  /**
   * Crea una instancia del caso de uso.
   * @param subscriptionRepository Repositorio de suscripciones utilizado para leer/actualizar datos.
   * @param paymentGatewayRepository Repositorio del gateway de pago para capturar órdenes.
   * @param transactionManager Administrador de transacciones para asegurar atomicidad.
   */
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly paymentGatewayRepository: PaymentGatewayRepository,
    private readonly transactionManager: ITransactionManager,
  ) {
    this.findSubscriptionByIdUseCase = new FindSubscriptionByIdUseCase(
      subscriptionRepository,
    );
  }

  /**
   * Reintenta el cobro y reactiva una suscripción un orderId del gateway de pago.
   * Si la captura es exitosa, actualiza la suscripción y habilita el premium del usuario.
   *
   * Pasos internos:
   * - Obtiene la suscripción y su último historial.
   * - Captura la orden en el gateway (orderId).
   * - Marca el historial como activo por 1 mes adicional.
   * - Persiste los cambios y, si aplica, actualiza la cuenta del usuario a premium.
   *
   * Errores:
   * - Lanza AppError si la persistencia falla después de una captura exitosa, para permitir resolución manual.
   *
   * @param subscriptionId ID de la suscripción a reintentar el pago y reactivar.
   * @param orderId ID de la orden generada por el gateway de pago a capturar.
   * @returns Promesa que se resuelve cuando el proceso finaliza.
   */
  async run(subscriptionId: string, orderId: string): Promise<void> {
    const today = new Date();

    /** 1. Consultamos la suscripción a reintentar el pago por Id */
    const subscription =
      await this.findSubscriptionByIdUseCase.run(subscriptionId);

    /** 2. obtenemos el último item del historial actual */
    const lastHistoryItem = subscription.history.at(-1);

    if (!lastHistoryItem) return;

    /** 3. Ejecutamos el pago   */
    const { gatewayCustomerReference } =
      await this.paymentGatewayRepository.captureOrder(orderId);

    /** 4. Si el pago es éxitoso actualizamos la subscripción actual y 
     reactivamos el premium al usuario  si existe el userId */
    const updatedHistoryItem: SubscriptionHistory = {
      ...lastHistoryItem,
      status: "active",
      startDate: today,
      endDate: addMonths(today, 1),
    };

    const updatedHistory: SubscriptionHistory[] = subscription.history.map(
      (historyItem) => {
        if (historyItem.historyId === updatedHistoryItem.historyId)
          return updatedHistoryItem;
        return historyItem;
      },
    );
    try {
      await this.transactionManager.execute(async (ctx) => {
        await this.subscriptionRepository.updateSubscriptions(
          [
            {
              subscriptionId: subscription.subscriptionId,
              gatewayCustomerReference,
              currentHistoryId: updatedHistoryItem.historyId,
              language: subscription.language,
              history: updatedHistory,
              userId: subscription.userId,
            },
          ],
          ctx,
        );

        await UsersFeature.repository.updateAccountType(
          subscription.userId,
          true,
          ctx,
        );
      });
    } catch (mongoError) {
      throw new AppError(
        ErrorMessages.SUBSCRIPTION_CREATION_ERROR,
        500,
        "Payment successful but subscription creation failed. Our team will resolve this shortly.",
        true,
        { mongoError, gatewayCustomerReference, userId: subscription.userId },
      );
    }
  }
}
