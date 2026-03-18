import { SubscriptionRepository } from "../../domain/repositories";

import { CreateSubscriptionPlansInput } from "../dto";

/**
 * Caso de uso para crear uno o varios planes de suscripción en el sistema.
 *
 * Se encarga de delegar la persistencia de los planes al repositorio correspondiente.
 *
 * @example
 * ```ts
 * const useCase = new CreateSubscriptionPlansUseCase(subscriptionRepo);
 * await useCase.run({ plans: [...] });
 * ```
 */
export class CreateSubscriptionPlansUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  /**
   * Ejecuta la creación de los planes de suscripción.
   *
   * @param createSubscriptionPlansInput - objeto que contiene la lista de
   *        planes a registrar.
   */
  async run(
    createSubscriptionPlansInput: CreateSubscriptionPlansInput,
  ): Promise<void> {
    const { plans } = createSubscriptionPlansInput;
    await this.subscriptionRepository.createSubscriptionPlans(plans);
  }
}
