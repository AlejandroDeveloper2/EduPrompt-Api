import axios from "axios";
import {
  CheckoutPaymentIntent,
  OrderRequest,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import { v4 as uuid } from "uuid";

import { config } from "@/config/enviromentVariables";
import { paypalClient } from "@/config/paypalConfig";

import { CreateOrderResult } from "@/features/subscriptions/domain/repositories";
import { ProductDetails } from "@/features/subscriptions/domain/types";

import { PaypalOrderMapper } from "../mappers/PaypalOrder.mapper";
import { PaypalCustomerMapper } from "../mappers/PayPalCustomer.mapper";

const ordersController = new OrdersController(paypalClient);

/**
 * Helper estático para crear órdenes en PayPal.
 *
 * Contiene métodos para obtener el token de acceso y crear
 * órdenes tanto para suscripciones como para pagos normales.
 */
export class PaypalCreateOrders {
  /**
   * Obtiene un token de acceso (OAuth2) desde la API de PayPal.
   *
   * @returns {Promise<string>} Token de acceso válido
   */
  private static async getAccessToken(): Promise<string> {
    const clientId = config.PAYPAL_CLIENT_ID;
    const clientSecret = config.PAYPAL_SECRET_KEY;
    const baseUrl = config.PAYPAL_API_URL;

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64",
    );
    const { data } = await axios.post(
      `${baseUrl}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return data.access_token as string;
  }

  static async createSubscriptionOrder(
    productDetails: ProductDetails,
  ): Promise<CreateOrderResult> {
    const accessToken = await this.getAccessToken();
    const baseUrl = config.PAYPAL_API_URL;

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: productDetails.price.toString(),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: productDetails.price.toString(),
              },
            },
          },
          items: [
            {
              name: productDetails.title,
              unit_amount: {
                currency_code: "USD",
                value: productDetails.price.toString(),
              },
              quantity: "1",
              description: productDetails.description,
            },
          ],
        },
      ],
      payment_source: {
        paypal: {
          attributes: {
            vault: {
              store_in_vault: "ON_SUCCESS",
              usage_type: "MERCHANT",
              customer_type: "CONSUMER",
            },
          },
          experience_context: {
            return_url: config.PAYPAL_RETURN_URL,
            cancel_url: config.PAYPAL_RETURN_URL,
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
          },
        },
      },
    };

    const response = await axios.post(
      `${baseUrl}/v2/checkout/orders`,
      orderPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": uuid(),
          Prefer: "return=representation",
        },
      },
    );

    return {
      order: PaypalOrderMapper.toPaymentOrder(response.data),
      gatewayCustomerReference: PaypalCustomerMapper.toGatewayReference(
        response.data,
      ),
    };
  }

  static async createNormalOrder(
    productDetails: ProductDetails,
  ): Promise<CreateOrderResult> {
    const collect: { body: OrderRequest; prefer?: string } = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD",
              value: productDetails.price.toString(),
              breakdown: {
                itemTotal: {
                  currencyCode: "USD",
                  value: productDetails.price.toString(),
                },
              },
            },
            items: [
              {
                name: productDetails.title,
                unitAmount: {
                  currencyCode: "USD",
                  value: productDetails.price.toString(),
                },
                quantity: "1",
                description: productDetails.description,
              },
            ],
          },
        ],
      },
      prefer: "return=representation",
    };

    const paypalOrder = await ordersController.createOrder(collect);

    return {
      order: PaypalOrderMapper.toPaymentOrder(paypalOrder.result),
      gatewayCustomerReference: PaypalCustomerMapper.toGatewayReference(
        paypalOrder.result,
      ),
    };
  }
}
