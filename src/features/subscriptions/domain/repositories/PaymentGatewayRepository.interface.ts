import {
  CapturedOrder,
  GatewayCustomerReference,
  OrderStatusResponse,
  PaymentOrder,
  ProductDetails,
} from "../types";

export interface CreateOrderResult {
  order: PaymentOrder;
  gatewayCustomerReference: GatewayCustomerReference;
}

export interface CaptureOrderResult {
  capturedOrder: CapturedOrder;
  gatewayCustomerReference: GatewayCustomerReference;
}

export interface PaymentGatewayRepository<
  TOrder extends PaymentOrder = PaymentOrder,
> {
  createOrder: (productDetails: ProductDetails) => Promise<CreateOrderResult>;
  createOrderFromReference: (
    productDetails: ProductDetails,
    gatewayReference: GatewayCustomerReference,
  ) => Promise<TOrder>;
  captureOrder: (orderId: string) => Promise<CaptureOrderResult>;
  findOrderStatus: (orderId: string) => Promise<OrderStatusResponse | null>;
}
