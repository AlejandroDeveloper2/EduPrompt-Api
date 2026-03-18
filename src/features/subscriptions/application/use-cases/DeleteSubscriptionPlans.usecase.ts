import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { SubscriptionRepository } from "../../domain/repositories";

import { DeleteSubscriptionPlansInput } from "../dto";

/**
 * Caso de uso para eliminar planes de suscripción existentes.
 *
 * Verifica que al menos uno de los IDs proporcionados haya sido borrado, de lo
 * contrario lanza un error.
 *
 * @example
 * ```ts
 * const useCase = new DeleteSubscriptionPlansUseCase(subscriptionRepo);
 * await useCase.run({ planIds: [...] });
 * ```
 */
export class DeleteSubscriptionPlansUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  /**
   * Ejecuta la eliminación de planes de suscripción.
   *
   * @param deleteSubscriptionPlansInput - contiene los identificadores de los
   *        planes que se desean borrar.
   * @throws {AppError} Si ningún plan coincide con los IDs proporcionados.
   */
  async run(
    deleteSubscriptionPlansInput: DeleteSubscriptionPlansInput,
  ): Promise<void> {
    const { planIds } = deleteSubscriptionPlansInput;

    const deleteCount =
      await this.subscriptionRepository.deleteSubscriptionPlans(planIds);

    if (deleteCount === 0)
      throw new AppError(
        ErrorMessages.SOME_SUBSCRIPTION_PLAN_NOT_FOUND,
        404,
        "Some subscription plan does not exists in the database",
        true,
      );
  }
}
