import { OrderStatus as PaypalOrderStatus } from "@paypal/paypal-server-sdk";

import { OrderStatus } from "../../../../domain/types";

const PAYPAL_STATUS_MAP: Record<PaypalOrderStatus, OrderStatus> = {
  CREATED: "CREATED",
  SAVED: "SAVED",
  APPROVED: "APPROVED",
  PAYER_ACTION_REQUIRED: "PENDING",
  COMPLETED: "COMPLETED",
  VOIDED: "CANCELLED",
};

/**
 * Mapeador de estados de órdenes de PayPal
 * Convierte los estados de PayPal a estados estandarizados del dominio
 */
export class PaypalStatusMapper {
  /**
   * Convierte un estado de PayPal al estado del dominio
   * @param {PaypalOrderStatus} paypalStatus - Estado de la orden desde PayPal
   * @returns {OrderStatus} Estado de la orden en el dominio de la aplicación
   * @throws {Error} Si el estado de PayPal no está mapeado
   */
  static toDomain(paypalStatus: PaypalOrderStatus): OrderStatus {
    const mapped = PAYPAL_STATUS_MAP[paypalStatus];

    if (!mapped) {
      throw new Error(`Unhandled PayPal order status: ${paypalStatus}`);
    }

    return mapped;
  }
}
