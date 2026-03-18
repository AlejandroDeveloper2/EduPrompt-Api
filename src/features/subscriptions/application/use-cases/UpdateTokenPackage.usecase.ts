import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { SubscriptionRepository } from "../../domain/repositories";

import { UpdateTokenPackageInput } from "../dto";

/**
 * Caso de uso que permite actualizar la configuración de un paquete de tokens.
 *
 * Verifica que el paquete exista antes de realizar la actualización.
 *
 * @example
 * ```ts
 * const useCase = new UpdateTokenPackageUseCase(subscriptionRepo);
 * await useCase.run(packageId, { quantity: 1000 });
 * ```
 */
export class UpdateTokenPackageUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  /**
   * Ejecuta la actualización del paquete de tokens.
   *
   * @param packageId - identificador del paquete a actualizar.
   * @param updateTokenPackageInput - datos con los valores a cambiar.
   * @throws {AppError} si el paquete no existe en la base de datos.
   */
  async run(
    packageId: string,
    updateTokenPackageInput: UpdateTokenPackageInput,
  ): Promise<void> {
    const { matchCount } = await this.subscriptionRepository.updateTokenPackage(
      packageId,
      updateTokenPackageInput,
    );

    if (matchCount === 0)
      throw new AppError(
        ErrorMessages.TOKEN_PACKAGE_NOT_FOUND,
        404,
        "Token package does not exists in the database",
        true,
      );
  }
}
