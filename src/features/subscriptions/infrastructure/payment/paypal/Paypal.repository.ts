import {
  CheckoutPaymentIntent,
  OrdersController,
  OrderRequest,
} from "@paypal/paypal-server-sdk";
import { v4 as uuid } from "uuid";

import { paypalClient } from "@/config/paypalConfig";

import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import {
  GatewayCustomerReference,
  OrderStatusResponse,
  PaymentOrder,
  ProductDetails,
} from "@/features/subscriptions/domain/types";

import {
  CaptureOrderResult,
  CreateOrderResult,
  PaymentGatewayRepository,
} from "@/features/subscriptions/domain/repositories";

import { PaypalOrderMapper } from "./mappers/PaypalOrder.mapper";
import { PaypalCustomerMapper } from "./mappers/PayPalCustomer.mapper";
import { PaypalStatusMapper } from "./mappers/PayPalStatus.mapper";
import { PaypalCreateOrders } from "./helpers/PaypalCreateOrders";

const ordersController = new OrdersController(paypalClient);

/**
 * Repositorio de la pasarela PayPal.
 *
 * Provee métodos para crear órdenes (normales y de suscripción),
 * crear órdenes usando una fuente de pago guardada, capturar órdenes
 * y consultar el estado de una orden.
 *
 * Implementa la interfaz PaymentGatewayRepository para PaymentOrder.
 *
 * Ejemplo breve:
 * ```typescript
 * const repo = new PaypalRepository();
 * const order = await repo.createOrder(productDetails);
 * const result = await repo.captureOrder(order.gatewayCustomerReference.id);
 * ```
 */
export class PaypalRepository implements PaymentGatewayRepository<PaymentOrder> {
  /**
   * Crea una nueva orden de PayPal para un producto o plan de suscripción.
   *
   * @param {ProductDetails} productDetails - Los detalles del producto o suscripción para crear una orden
   * @returns {Promise<CreateOrderResult>} La orden creada y la referencia del cliente de la puerta de pago
   * @throws {AppError} Cuando ocurre un error durante la creación de la orden (HTTP 500)
   */

  async createOrder(
    productDetails: ProductDetails,
  ): Promise<CreateOrderResult> {
    try {
      if (productDetails.productType === "subscription")
        return await PaypalCreateOrders.createSubscriptionOrder(productDetails);

      return await PaypalCreateOrders.createNormalOrder(productDetails);
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.CREATE_ORDER_ERROR,
        500,
        "An error occurred while processing the order.",
        false,
        error,
      );
    }
  }

  /**
   * Crea una orden de PayPal utilizando una fuente de pago previamente guardada.
   *
   * @param {ProductDetails} productDetails - Los detalles del producto o suscripción para crear una orden
   * @param {GatewayCustomerReference} gatewayReference - La referencia de la fuente de pago guardada
   * @returns {Promise<PaymentOrder>} La orden de pago creada
   * @throws {AppError} Cuando ocurre un error durante la creación de la orden (HTTP 500) o cuando no tiene el vaultId (HTTP 400)
   */
  async createOrderFromReference(
    productDetails: ProductDetails,
    gatewayReference: GatewayCustomerReference,
  ): Promise<PaymentOrder> {
    try {
      if (!gatewayReference.vaultId) {
        throw new AppError(
          "MISSING_VAULT_ID",
          400,
          "No vaultId found for this subscription.",
          true,
        );
      }

      const collect: {
        body: OrderRequest;
        prefer?: string;
        paypalRequestId: string;
      } = {
        paypalRequestId: uuid(),
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
          paymentSource: {
            paypal: { vaultId: gatewayReference.vaultId },
          },
        },

        prefer: "return=representation",
      };

      const resultOrder = await ordersController.createOrder(collect);

      return PaypalOrderMapper.toPaymentOrder(resultOrder.result);
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.CREATE_ORDER_ERROR,
        500,
        "An error occurred while processing the order.",
        false,
        error,
      );
    }
  }
  /**
   * Captura una orden de PayPal previamente autorizada.
   *
   * @param {string} orderId - El ID de la orden de PayPal a capturar
   * @returns {Promise<CaptureOrderResult>} Los detalles de la orden capturada
   * @throws {AppError} Cuando ocurre un error durante la captura de la orden (HTTP 500)
   */
  async captureOrder(orderId: string): Promise<CaptureOrderResult> {
    try {
      const paypalOrder = await ordersController.captureOrder({ id: orderId });

      const gatewayCustomerReference = PaypalCustomerMapper.toGatewayReference(
        paypalOrder.result,
      );
      const capturedOrder = PaypalOrderMapper.toCapturedOrder(
        paypalOrder.result,
      );

      return {
        capturedOrder,
        gatewayCustomerReference,
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.CAPTURE_ORDER_ERROR,
        500,
        "An error occurred while capturing the order.",
        false,
        error,
      );
    }
  }

  /**
   * Obtiene una orden de PayPal previamente guardada.
   *
   * @param {string} orderId - El ID de la orden de PayPal a obtener
   * @returns {Promise<OrderStatusResponse|null>} Los detalles de la orden y null si no se encuentra
   * @throws {AppError} Cuando ocurre un error durante la busqueda de la orden (HTTP 500)
   */
  async findOrderStatus(orderId: string): Promise<OrderStatusResponse | null> {
    try {
      const order = await ordersController.getOrder({ id: orderId });

      if (!order.result.id || !order.result.status) return null;

      return {
        orderId: order.result.id,
        status: PaypalStatusMapper.toDomain(order.result.status),
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.GET_ORDER_ERROR,
        500,
        "An error occurred while listing the order with id: " + orderId,
        false,
        error,
      );
    }
  }
}
