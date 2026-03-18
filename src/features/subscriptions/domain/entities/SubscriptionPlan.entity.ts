import { LangTemplate } from "@/core/domain/types";
import { PaymentFrecuency } from "../types";

/**
 * Representa un plan de suscripción disponible para los usuarios.
 * Incluye información de identificación, contenido, beneficios,
 * frecuencia de pago, precio y estado actual de la suscripción.
 */
export class SubscriptionPlan {
  /**
   * Crea una instancia de SubscriptionPlan.
   * @param subscriptionPlanId Identificador único del plan de suscripción.
   * @param title Título comercial del plan.
   * @param description Descripción breve del contenido del plan.
   * @param benefits Lista de beneficios incluidos en el plan.
   * @param paymentFrecuency Frecuencia de pago del plan (por ejemplo, mensual o anual).
   * @param price Precio del plan según la frecuencia de pago.
   */
  constructor(
    public readonly subscriptionPlanId: string,
    public title: LangTemplate<string>,
    public description: LangTemplate<string>,
    public benefits: LangTemplate<string[]>,
    public paymentFrecuency: PaymentFrecuency,
    public price: number,
  ) {}
}
