import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { Subscription } from "../../domain/entities";
import { SubscriptionRepository } from "../../domain/repositories";

/**
 * Caso de uso para recuperar una suscripción por el identificador del usuario propietario.
 *
 * Lanza un error si no existe la suscripción.
 *
 * @example
 * ```ts
 * const useCase = new FindSubscriptionByUserUseCase(subscriptionRepo);
 * const sub = await useCase.run(userId);
 * ```
 */
export class FindSubscriptionByUserUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}
  /**
   * Ejecuta la búsqueda de la suscripción.
   *
   * @param userId - identificador del usuario propietario de la suscripción.
   * @returns la suscripción encontrada.
   * @throws {AppError} si la suscripción no existe.
   */
  async run(userId: string): Promise<Subscription> {
    const subscription =
      await this.subscriptionRepository.findSubscriptionByUser(userId);

    if (subscription === null)
      throw new AppError(
        ErrorMessages.SUBSCRIPTION_NOT_FOUND,
        404,
        `Subscription with the user Id ${userId} not found in the database.`,
        true,
      );

    return subscription;
  }
}
