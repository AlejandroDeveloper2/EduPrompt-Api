import { SubscriptionPlanDto, SubscriptionPlanOutput } from "../dto";

import { SubscriptionPlan } from "../../domain/entities";

/**
 * Transforma una entidad SubscriptionPlan en un objeto de respuesta seguro para el endpoint de subscriptionPlans.
 *
 * Esta función toma una instancia de la entidad SubscriptionPlan, extrae únicamente los campos necesarios
 * (sin incluir información sensible), y valida la estructura resultante usando el DTO SubscriptionPlanDto.
 *
 * @param entity Instancia de SubscriptionPlan proveniente de la base de datos.
 * @returns Objeto validado de tipo SubscriptionPlanOutput, listo para ser enviado como respuesta al cliente.
 */
export const toSubscriptionPlanOutputDto = (
  entity: SubscriptionPlan,
): SubscriptionPlanOutput => {
  const json = {
    subscriptionPlanId: entity.subscriptionPlanId,
    title: entity.title,
    description: entity.description,
    benefits: entity.benefits,
    paymentFrecuency: entity.paymentFrecuency,
    price: entity.price,
  };

  return SubscriptionPlanDto.parse(json);
};
