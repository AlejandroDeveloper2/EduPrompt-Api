import crypto from "node:crypto";
import { hash } from "bcryptjs";

import { ApiKeyRepositoryType } from "../../domain/repositories/ApiKeyRepository.interface";

import { CreateApiKeyInput } from "../dto/apiKey.dto";

export class CreateApiKeyUseCase {
  constructor(private apiKeyRepository: ApiKeyRepositoryType) {}

  /**
   * Genera un identificador único para una API Key.
   *
   * Combina un prefijo con 16 bytes aleatorios en formato hexadecimal para crear
   * un identificador único e irrevocable.
   *
   * @param prefix - Prefijo para identificar el tipo de clave (por defecto: `"ak_live"`).
   * @returns Identificador único en formato `<prefijo>_<hexAleatorio>`.
   *
   * @example
   * ```ts
   * const keyId = service.getRandomId(); // "ak_live_a1b2c3d4e5f6g7h8..."
   * const testKeyId = service.getRandomId("ak_test"); // "ak_test_..."
   * ```
   */
  private getRandomId(prefix = "ak_live"): string {
    return `${prefix}_${crypto.randomBytes(16).toString("hex")}`;
  }

  /**
   * Genera un secreto criptográficamente seguro para la API Key.
   *
   * Emite 32 bytes de datos aleatorios y los codifica en Base64 URL-safe para
   * asegurar que el secreto sea seguro de transportar y almacenar.
   *
   * @returns Secreto aleatorio de 32 bytes codificado en Base64 URL-safe.
   *
   * @example
   * ```ts
   * const secret = service.getRandomSecret(); // "ABc1d2E3f4G5h6I7j8K9l0M1n2O3p4Q=="
   * ```
   */
  private getRandomSecret(): string {
    return crypto.randomBytes(32).toString("base64url"); // URL-safe
  }
  /**
   * Crea una nueva API Key y la persiste en la base de datos.
   *
   * **Proceso:**
   * 1. Genera un identificador único (keyId).
   * 2. Genera un secreto aleatorio y lo hashea con bcrypt (salt: 12).
   * 3. Almacena en la base de datos con los metadatos especificados.
   * 4. Retorna el token completo (keyId.secret) que debe presentarse **una sola vez**.
   *
   * **Nota:** El cliente debe guardar el token retornado ya que no se podrá recuperar,
   * solo podrá verificarse.
   *
   * @param input - Configuración de la API Key.
   * @param input.name - Nombre descriptivo de la API Key.
   * @param input.scopes - Array de permisos otorgados a la clave.
   * @param input.expiresAt - Fecha de expiración opcional.
   *
   * @returns Objeto con el token completo e identificador:
   * @returns {string} token - Formato: `<keyId>.<secret>` (mostrar solo una vez al usuario).
   * @returns {string} keyId - Identificador único de la API Key.
   *
   * @throws {Error} Si ocurre un error al almacenar en el repositorio.
   *
   * @example
   * ```ts
   * const { token, keyId } = await useCase.run({
   *   name: "Integración con LMS",
   *   scopes: ["READ_COURSES", "WRITE_GRADES"],
   *   expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
   * });
   *
   * console.log(token); // "ak_live_a1b2c3d4e5f6..."
   * // Guardar token en lugar seguro, no se recupera después
   * ```
   */
  async run(
    input: CreateApiKeyInput,
  ): Promise<{ token: string; keyId: string }> {
    const keyId = this.getRandomId();
    const secret = this.getRandomSecret();
    const secretHash = await hash(secret, 12);

    await this.apiKeyRepository.create({
      keyId,
      name: input.name,
      secretHash,
      scopes: input.scopes,
      active: true,
      expiresAt: input.expiresAt ?? null,
    });

    return { token: `${keyId}.${secret}`, keyId };
  }
}
