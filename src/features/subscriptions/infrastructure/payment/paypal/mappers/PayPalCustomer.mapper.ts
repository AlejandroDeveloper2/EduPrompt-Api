import {
  Order,
  PaymentSourceResponse,
  PaypalPaymentTokenUsageType,
  PaypalWallet,
  PaypalWalletContextShippingPreference,
} from "@paypal/paypal-server-sdk";

import { GatewayCustomerReference } from "../../../../domain/types";

/**
 * Mapeador de clientes de PayPal
 * Convierte información de clientes de PayPal a referencias del gateway de pago
 */
export class PaypalCustomerMapper {
  /**
   * Convierte la respuesta de una orden de PayPal a una referencia de cliente del gateway
   * @param {Order} paypalOrderResponse - Respuesta de orden de PayPal
   * @returns {GatewayCustomerReference} Referencia del cliente para el gateway de pago
   */
  static toGatewayReference(
    paypalOrderResponse: Order,
  ): GatewayCustomerReference {
    const vaultData =
      paypalOrderResponse.paymentSource?.paypal?.attributes?.vault ||
      paypalOrderResponse.paymentSource?.card?.attributes?.vault;

    return {
      gateway: "paypal",
      customerId: paypalOrderResponse.payer?.payerId,
      vaultId: vaultData?.id ?? null,
      gatewayRawData: {
        payerId: paypalOrderResponse.payer?.payerId,
        payerEmail: paypalOrderResponse.payer?.emailAddress,
        paymentSource: paypalOrderResponse.paymentSource,
      },
    };
  }

  /**
   * Convierte una referencia de cliente del gateway a formato de fuente de pago de PayPal
   * @param {GatewayCustomerReference} reference - Referencia del cliente del gateway
   * @returns {object} Objeto con datos de fuente de pago de PayPal (PayPal, Venmo o tarjeta)
   */
  static toPaypalPaymentSource(reference: GatewayCustomerReference): object {
    const raw = reference.gatewayRawData as {
      payerId: string | undefined;
      payerEmail: string | undefined;
      paymentSource: PaymentSourceResponse | undefined;
    };

    /** Para pagos recurrentes */
    if (reference.vaultId) {
      const paypalWallet: PaypalWallet = {
        vaultId: reference.vaultId,
        attributes: {
          vault: {
            usageType: PaypalPaymentTokenUsageType.Merchant,
          },
        },
        experienceContext: {
          shippingPreference: PaypalWalletContextShippingPreference.NoShipping,
        },
      };
      return {
        paypal: paypalWallet,
      };
    }

    return {
      paypal: raw.paymentSource?.paypal,
      venmo: raw.paymentSource?.venmo,
      card: raw.paymentSource?.card,
    };
  }
}
