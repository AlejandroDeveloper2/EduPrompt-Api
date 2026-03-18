import { TokenPackageDto, TokenPackageOutput } from "../dto";

import { TokenPackage } from "../../domain/entities";

/**
 * Transforma una entidad TokenPackage en un objeto de respuesta seguro para el endpoint de tokenPackages.
 *
 * Esta función toma una instancia de la entidad TokenPackage, extrae únicamente los campos necesarios
 * (sin incluir información sensible), y valida la estructura resultante usando el DTO TokenPackageDto.
 *
 * @param entity Instancia de TokenPackage proveniente de la base de datos.
 * @returns Objeto validado de tipo TokenPackageOutput, listo para ser enviado como respuesta al cliente.
 */
export const toTokenPackageOutputDto = (
  entity: TokenPackage,
): TokenPackageOutput => {
  const json = {
    packageId: entity.packageId,
    title: entity.title,
    description: entity.description,
    benefits: entity.benefits,
    price: entity.price,
    tokenAmount: entity.tokenAmount,
  };

  return TokenPackageDto.parse(json);
};
