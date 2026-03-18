import { Lang } from "@/core/domain/types";
import { GatewayCustomerReference, SubscriptionHistory } from "../types";

/**
 * Entidad de dominio que representa una suscripción de un usuario en el sistema.
 * Mantiene la referencia del cliente en el gateway de pagos, el historial de estados
 * y metadatos de creación.
 *
 * Los identificadores (subscriptionId, currentHistoryId y userId) son inmutables;
 * los demás campos pueden actualizarse mediante casos de uso del dominio.
 */
export class Subscription {
  /**
   * Crea una nueva instancia de suscripción.
   * @param {string} subscriptionId Identificador único de la suscripción en el dominio.
   * @param {GatewayCustomerReference} gatewayCustomerReference Referencia del cliente en el gateway de pagos (por ejemplo, PayPal o Stripe).
   * @param {SubscriptionHistory[]} history Historial de eventos/estados de la suscripción en orden cronológico.
   * @param {Date} createdAt Fecha de creación de la suscripción.
   * @Param {Lang} language Etiqueta de idioma del usuario.
   * @param {string} currentHistoryId Identificador del elemento del historial que representa el estado actual.
   * @param {string} [userId] Identificador del usuario propietario de la suscripción.
   *
   */
  constructor(
    public readonly subscriptionId: string,
    public gatewayCustomerReference: GatewayCustomerReference,
    public history: SubscriptionHistory[],
    public createdAt: Date,
    public language: Lang,
    public readonly currentHistoryId: string,
    public readonly userId: string,
  ) {}
}
