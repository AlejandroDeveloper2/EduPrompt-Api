import { SubscriptionRepository } from "../../domain/repositories";

import { CreateTokenPackagesInput } from "../dto";

/**
 * Caso de uso encargado de crear paquetes de tokens disponibles para compra.
 *
 * Simplemente reenvía la lista de paquetes al repositorio de suscripciones.
 *
 * @example
 * ```ts
 * const useCase = new CreateTokenPackagesUseCase(subscriptionRepo);
 * await useCase.run({ packages: [...] });
 * ```
 */
export class CreateTokenPackagesUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  /**
   * Ejecuta la creación de paquetes de tokens.
   *
   * @param createTokenPackagesInput - datos que contienen los paquetes a
   *        almacenar.
   */
  async run(createTokenPackagesInput: CreateTokenPackagesInput): Promise<void> {
    const { packages } = createTokenPackagesInput;
    await this.subscriptionRepository.createTokenPackages(packages);
  }
}
