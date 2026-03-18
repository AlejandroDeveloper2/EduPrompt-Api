import { SubscriptionPlan } from "../../domain/entities";

import { SubscriptionRepository } from "../../domain/repositories";

/**
 * Caso de uso responsable de recuperar los planes de suscripción definidos.
 *
 * Devuelve todos los planes que existen en la base de datos.
 *
 * @example
 * ```ts
 * const useCase = new FindSubscriptionPlansUseCase(subscriptionRepo);
 * const plans = await useCase.run();
 * ```
 */
export class FindSubscriptionPlansUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  /**
   * Realiza la consulta de planes.
   *
   * @returns lista de planes de suscripción.
   */
  async run(): Promise<SubscriptionPlan[]> {
    const plans = await this.subscriptionRepository.findSubscriptionsPlans();
    return plans;
  }
}
