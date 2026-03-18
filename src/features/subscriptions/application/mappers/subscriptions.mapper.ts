import { SubscriptionDto, SubscriptionOutput } from "../dto";

import { Subscription } from "../../domain/entities";

/**
 * Transforma una entidad Subscription en un objeto de respuesta seguro para el endpoint de subscriptions.
 *
 * Esta función toma una instancia de la entidad Subscription, extrae únicamente los campos necesarios
 * (sin incluir información sensible), y valida la estructura resultante usando el DTO SubscriptionDto.
 *
 * @param entity Instancia de Subscription proveniente de la base de datos.
 * @returns Objeto validado de tipo SubscriptionOutput, listo para ser enviado como respuesta al cliente.
 */
export const toSubscriptionOutputDto = (
  entity: Subscription,
): SubscriptionOutput => {
  const json = {
    subscriptionId: entity.subscriptionId,
    history: entity.history,
    currentHistoryId: entity.currentHistoryId,
  };

  return SubscriptionDto.parse(json);
};
