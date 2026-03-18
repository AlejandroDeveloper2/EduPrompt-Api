import { addMonths } from "date-fns";
import { v4 as uuid } from "uuid";

import { AppError } from "@/core/domain/exeptions/AppError";
import { ITransactionManager } from "@/core/domain/ports/ITransactionManager.interface";
import { ErrorMessages } from "@/shared/utils";

import { UsersFeature } from "@/features/users";

import {
  PaymentGatewayRepository,
  SubscriptionRepository,
} from "../../domain/repositories";

import { CaptureProductOrderInput } from "../dto";

/**
 * Caso de uso para capturar un pedido de producto.
 *
 * Si el producto no es una suscripción, simplemente se delega
 * la captura al gateway de pago. Para suscripciones se valida
 * el plan, se captura el pago primero y luego se crea la
 * suscripción en la base de datos dentro de una transacción.
 * Adicionalmente, si existe un `userId` se marca al usuario como
 * premium dentro de la misma transacción.
 *
 * @remarks
 *   - Inyecta los repositorios necesarios y un manejador de transacciones
 *     (`ITransactionManager`).
 *   - Retorna el identificador de la suscripción creada o `null` cuando se
 *     trata de un paquete de tokens.
 *   - Maneja errores específicos como plan no encontrado o fallos
 *     al persistir la suscripción una vez cobrado el pago.
 *
 * @example
 * ```ts
 * const useCase = new CaptureProductOrderUseCase(
 *   subscriptionRepo,
 *   paymentGatewayRepo,
 *   transactionManager,
 * );
 * const result = await useCase.run({ productDetails, orderId }, userId);
 * console.log(result.subscriptionId);
 * ```
 */
export class CaptureProductOrderUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly paymentGatewayRepository: PaymentGatewayRepository,
    private readonly transactionManager: ITransactionManager,
  ) {}

  /**
   * Ejecuta la lógica del caso de uso.
   *
   * @param captureProductOrderInput - datos necesarios para capturar el pedido,
   *        incluyendo detalles del producto y el identificador de orden.
   * @param userId - identificador opcional del usuario que realiza la compra.
   *        Si se proporciona, el perfil del usuario será marcado como premium
   *        dentro de la transacción.
   * @throws {AppError} Si no encuentra el plan de suscripción, si falla la
   *         captura del pago o si ocurre un error al crear la suscripción en
   *         la base de datos después de un pago exitoso.
   */
  async run(
    captureProductOrderInput: CaptureProductOrderInput,
    userId?: string,
  ): Promise<void> {
    const { productDetails, orderId } = captureProductOrderInput;

    //Caso: paquete de tokens
    if (productDetails.productType !== "subscription") {
      await this.paymentGatewayRepository.captureOrder(orderId);
      return;
    }

    //Caso: suscripción
    // 1. Validar plan antes de tocar nada externo y el user Id
    if (!userId)
      throw new AppError(
        ErrorMessages.AUTH_REQUIRED,
        400,
        "Authentication required to subscribe to the plan",
        true,
      );

    const plans = await this.subscriptionRepository.findSubscriptionsPlans();
    const plan = plans.find(
      (p) => p.subscriptionPlanId === productDetails.productId,
    );

    if (!plan)
      throw new AppError(
        ErrorMessages.SUBSCRIPTION_PLAN_NOT_FOUND,
        404,
        "Plan not found in the database",
        true,
      );

    // 2. Capturar pago en PayPal PRIMERO
    const { gatewayCustomerReference } =
      await this.paymentGatewayRepository.captureOrder(orderId);

    // 3️. Pago confirmado → persistir suscripción directamente como "active"
    const historyId = uuid();
    const startDate = new Date();
    const endDate = addMonths(startDate, 1);

    try {
      await this.transactionManager.execute(async (ctx) => {
        await this.subscriptionRepository.createSubscription(
          {
            gatewayCustomerReference,
            history: [
              {
                historyId,
                plan,
                status: "active",
                startDate,
                endDate,
              },
            ],
            currentHistoryId: historyId,
            language: productDetails.language ?? "es",
            userId,
          },
          ctx,
        );

        await UsersFeature.repository.updateUserSubscriptionState(
          userId,
          true,
          ctx,
        );

        await UsersFeature.repository.updateAccountType(userId, true, ctx);
      });
    } catch (mongoError) {
      throw new AppError(
        ErrorMessages.SUBSCRIPTION_CREATION_ERROR,
        500,
        "Payment successful but subscription creation failed. Our team will resolve this shortly.",
        true,
        { mongoError, gatewayCustomerReference, userId, plan },
      );
    }
  }
}
