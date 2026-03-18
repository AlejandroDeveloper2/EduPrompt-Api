import { TokenPackage } from "../../domain/entities";

import { SubscriptionRepository } from "../../domain/repositories";

/**
 * Caso de uso para obtener todos los paquetes de tokens disponibles.
 *
 * Consulta el repositorio de suscripciones y retorna la lista.
 *
 * @example
 * ```ts
 * const useCase = new FindTokenPackagesUseCase(subscriptionRepo);
 * const packages = await useCase.run();
 * ```
 */
export class FindTokenPackagesUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  /**
   * Ejecuta la búsqueda de paquetes de tokens.
   *
   * @returns arreglo de paquetes de tokens.
   */
  async run(): Promise<TokenPackage[]> {
    const tokenPackages = await this.subscriptionRepository.findTokenPackages();

    return tokenPackages;
  }
}
