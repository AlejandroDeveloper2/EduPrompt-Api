import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { SubscriptionRepository } from "../../domain/repositories";

import { UpdateSubscriptionPlanInput } from "../dto";

/**
 * Caso de uso responsable de actualizar los datos de un plan de suscripción.
 *
 * Valida que el plan exista antes de aplicar cambios.
 *
 * @example
 * ```ts
 * const useCase = new UpdateSubscriptionPlanUseCase(subscriptionRepo);
 * await useCase.run(planId, { title: "Nuevo Título" });
 * ```
 */
export class UpdateSubscriptionPlanUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  /**
   * Ejecuta la actualización del plan de suscripción.
   *
   * @param subscriptionPlanId - identificador del plan a actualizar.
   * @param updateSubscriptionPlanInput - objeto con los campos a modificar.
   * @throws {AppError} si el plan no existe en la base de datos.
   */
  async run(
    subscriptionPlanId: string,
    updateSubscriptionPlanInput: UpdateSubscriptionPlanInput,
  ): Promise<void> {
    const { matchCount } =
      await this.subscriptionRepository.updateSubscriptionPlan(
        subscriptionPlanId,
        updateSubscriptionPlanInput,
      );

    if (matchCount === 0)
      throw new AppError(
        ErrorMessages.SUBSCRIPTION_PLAN_NOT_FOUND,
        404,
        "Subscription plan does not exists in the database",
        true,
      );
  }
}
