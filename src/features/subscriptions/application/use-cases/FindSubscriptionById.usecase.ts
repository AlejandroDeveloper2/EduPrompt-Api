import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { Subscription } from "../../domain/entities";
import { SubscriptionRepository } from "../../domain/repositories";

/**
 * Caso de uso para recuperar una suscripción por su identificador.
 *
 * Lanza un error si no existe la suscripción.
 *
 * @example
 * ```ts
 * const useCase = new FindSubscriptionByIdUseCase(subscriptionRepo);
 * const sub = await useCase.run(subscriptionId);
 * ```
 */
export class FindSubscriptionByIdUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}
  /**
   * Ejecuta la búsqueda de la suscripción.
   *
   * @param subscriptionId - identificador de la suscripción.
   * @returns la suscripción encontrada.
   * @throws {AppError} si la suscripción no existe.
   */
  async run(subscriptionId: string): Promise<Subscription> {
    const subscription =
      await this.subscriptionRepository.findSubscriptionById(subscriptionId);

    if (subscription === null)
      throw new AppError(
        ErrorMessages.SUBSCRIPTION_NOT_FOUND,
        404,
        `Subscription ${subscriptionId} not found in the database.`,
        true,
      );

    return subscription;
  }
}
