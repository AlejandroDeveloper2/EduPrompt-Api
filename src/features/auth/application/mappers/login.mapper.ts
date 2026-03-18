import { LoginOutput, LoginResponseDto } from "../dto";

/**
 * Transforma la entidad de respuesta del endpoint de login en un DTO validado.
 *
 * Esta función toma un objeto que contiene el token de autenticación y refresh token generado tras un login exitoso,
 * lo transforma en el formato esperado por el DTO de salida (`LoginResponseDto`) y valida su estructura.
 * Si la validación es exitosa, retorna una instancia de `LoginOutput`.
 *
 * @param entity - Objeto que contiene el token de autenticación y el refresh token generado por el login.
 * @returns Una instancia validada de `LoginOutput`.
 */
export const toLoginResponseDto = (entity: {
  token: string;
  refreshToken: string;
}): LoginOutput => {
  const json: LoginOutput = {
    token: entity.token,
    refreshToken: entity.refreshToken,
  };

  return LoginResponseDto.parse(json);
};
