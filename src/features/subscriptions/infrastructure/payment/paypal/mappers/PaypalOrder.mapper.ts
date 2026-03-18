import { Order } from "@paypal/paypal-server-sdk";

import { PaymentOrder, CapturedOrder } from "../../../../domain/types";

import { PaypalStatusMapper } from "./PayPalStatus.mapper";

/**
 * Mapeador de órdenes de PayPal
 * Convierte las respuestas de PayPal a estructuras de dominio de la aplicación
 */
export class PaypalOrderMapper {
  /**
   * Convierte una orden de PayPal a una orden de pago del dominio
   * @param {Order} paypalOrder - Orden recibida de PayPal
   * @returns {PaymentOrder} Orden de pago mapeada al dominio de la aplicación
   */
  static toPaymentOrder(paypalOrder: Order): PaymentOrder {
    return {
      orderId: crypto.randomUUID(),
      gatewayOrderId: paypalOrder.id!,
      status: PaypalStatusMapper.toDomain(paypalOrder.status!),
      amount: Number(paypalOrder.purchaseUnits?.[0]?.amount?.value ?? 0),
      currency: paypalOrder.purchaseUnits?.[0]?.amount?.currencyCode ?? "USD",
      createdAt: new Date(),
      gatewayRawResponse: paypalOrder,
    };
  }
  /**
   * Convierte una orden de PayPal capturada a una orden capturada del dominio
   * @param {Order} paypalOrder - Orden de PayPal con pago capturado
   * @returns {CapturedOrder} Orden capturada con información de transacción
   */
  static toCapturedOrder(paypalOrder: Order): CapturedOrder {
    const capture = paypalOrder.purchaseUnits?.[0]?.payments?.captures?.[0];

    return {
      ...this.toPaymentOrder(paypalOrder),
      status: "COMPLETED",
      capturedAt: new Date(),
      transactionId: capture?.id ?? "",
    };
  }
}
