import { compare } from "bcryptjs";

import { ApiKeyRepositoryType } from "../../domain/repositories/ApiKeyRepository.interface";

export class VerifySecretUseCase {
  constructor(private apiKeyRepository: ApiKeyRepositoryType) {}

  /**
   * Valida que un secreto corresponda a la API Key especificada.
   *
   * **Validaciones realizadas:**
   * 1. Verifica que la API Key exista en la base de datos.
   * 2. Comprueba que el estado esté activo (`active === true`).
   * 3. Valida que no haya expirado (si tiene fecha de expiración).
   * 4. Compara el secreto proporcionado con el hash almacenado usando bcrypt.
   *
   * **Casos de rechazo:** La verificación falla si la clave no existe, está inactiva,
   * ha expirado, o el secreto no coincide.
   *
   * @param keyId - Identificador único de la API Key a verificar.
   * @param secret - Secreto proporcionado por el cliente (sin hashear).
   *
   * @returns `true` si todos los validaciones pasan y el secreto es correcto; `false` en caso contrario.
   *
   * @example
   * ```ts
   * const isValid = await useCase.run("ak_live_abc123", "secretBase64String");
   *
   * if (isValid) {
   *   // La API Key y secreto son válidos
   * } else {
   *   // La clave no existe, está expirada, inactiva, o el secreto es incorrecto
   * }
   * ```
   */
  async run(keyId: string, secret: string): Promise<boolean> {
    const apiKey = await this.apiKeyRepository.findById(keyId);

    if (!apiKey || !apiKey.active) return false;
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return false;

    return compare(secret, apiKey.secretHash);
  }
}
