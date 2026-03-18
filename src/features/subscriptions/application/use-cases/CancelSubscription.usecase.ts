import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";
import { ITransactionManager } from "@/core/domain/ports/ITransactionManager.interface";

import { UsersFeature } from "@/features/users";

import { SubscriptionRepository } from "../../domain/repositories";

/**
 * Caso de uso responsable de cancelar una suscripción existente.
 *
 * Recibe el identificador de la suscripción y el historial actual para
 * marcar el ítem correspondiente como "cancelled". Si se proporciona
 * `userId`, también actualiza el perfil del usuario a no premium.
 * Lanza errores si la suscripción o el historial no existen o no se modifican.
 *
 * @example
 * ```ts
 * const useCase = new CancelSubscriptionUseCase(subscriptionRepo, txManager);
 * await useCase.run(subscriptionId, currentHistoryId, userId);
 * ```
 */
export class CancelSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly transactionManager: ITransactionManager,
  ) {}

  /**
   * Ejecuta la cancelación del historial de la suscripción.
   *
   * @param subscriptionId - id de la suscripción a cancelar.
   * @param currentHistoryId - id del item de historial que se debe actualizar.
   * @param userId - Actualiza la cuenta del usuario
   *        para marcarla como no premium tras la cancelación.
   * @throws {AppError} Cuando la suscripción o el registro de historial no se
   *         pueden encontrar o modificar.
   */
  async run(
    subscriptionId: string,
    currentHistoryId: string,
    userId: string,
  ): Promise<void> {
    await this.transactionManager.execute(async (ctx) => {
      const { matchCount, modifiedCount } =
        await this.subscriptionRepository.updateSubscriptionStatus(
          subscriptionId,
          currentHistoryId,
          "cancelled",
          ctx,
        );

      if (matchCount === 0)
        throw new AppError(
          ErrorMessages.SUBSCRIPTION_NOT_FOUND,
          404,
          `Subscription with id ${subscriptionId} not found in the database`,
          true,
        );

      if (modifiedCount === 0)
        throw new AppError(
          ErrorMessages.SUBSCRIPTION_HISTORY_ITEM_NOT_FOUND,
          404,
          `History item ${currentHistoryId} not found or value unchanged`,
          true,
        );

      await UsersFeature.repository.updateAccountType(userId, false, ctx);
    });
  }
}
