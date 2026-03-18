import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { SubscriptionRepository } from "../../domain/repositories";

import { DeleteTokenPackagesInput } from "../dto";

/**
 * Caso de uso que elimina paquetes de tokens existentes.
 *
 * Se asegura de que al menos uno de los IDs resulte eliminado, de lo contrario
 * lanza un error.
 *
 * @example
 * ```ts
 * const useCase = new DeleteTokenPackagesUseCase(subscriptionRepo);
 * await useCase.run({ packageIds: [...] });
 * ```
 */
export class DeleteTokenPackagesUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  /**
   * Ejecuta la eliminación de paquetes.
   *
   * @param deleteTokenPackagesInput - contiene los IDs de los paquetes.
   * @throws {AppError} si ningún paquete coincide con los IDs dados.
   */
  async run(deleteTokenPackagesInput: DeleteTokenPackagesInput): Promise<void> {
    const { packageIds } = deleteTokenPackagesInput;

    const deleteCount =
      await this.subscriptionRepository.deleteTokenPackages(packageIds);

    if (deleteCount === 0)
      throw new AppError(
        ErrorMessages.SOME_TOKEN_PACKAGE_NOT_FOUND,
        404,
        "Some package does not exists in the database",
        true,
      );
  }
}
