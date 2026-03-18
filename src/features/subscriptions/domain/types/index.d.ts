import { Lang } from "@/core/domain/types";
import { Subscription, SubscriptionPlan, TokenPackage } from "../entities";

/** Payment types */
type OrderStatus =
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED"
  | "APPROVED"
  | "CREATED"
  | "SAVED";

interface PaymentOrder {
  orderId: string;
  status: OrderStatus;
  amount: number;
  currency: string;
  gatewayOrderId: string;
  gatewayRawResponse?: unknown | undefined;
  createdAt: Date;
}
export interface CapturedOrder extends PaymentOrder {
  capturedAt: Date;
  transactionId: string;
}

interface GatewayCustomerReference {
  gateway: "paypal" | "stripe" | "mercadopago";
  customerId?: string | undefined;
  paymentMethodId?: string | undefined;
  gatewayRawData: unknown;
  vaultId: string | null;
}

interface OrderStatusResponse {
  orderId: string;
  status: OrderStatus;
}

/** Subscription plans and packages */
type PaymentFrecuency = "monthly" | "yearly";
type SubscriptionStatus = "cancelled" | "active" | "inactive" | "failed";
type ProductDetails = {
  productId: string;
  title: string;
  description: string;
  price: number;
  productType: "subscription" | "token_package";
  language?: Lang | undefined;
  tokenAmount?: number | undefined;
};
type CreatePackage = Omit<TokenPackage, "packageId">;
type UpdatePackage = CreatePackage;
type CreateSubscriptionPlan = Omit<SubscriptionPlan, "subscriptionPlanId">;
type UpdateSubscriptionPlan = CreateSubscriptionPlan;

/** User subscriptions */
interface SubscriptionHistory {
  historyId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
}

type CreateSubscription = Omit<Subscription, "subscriptionId" | "createdAt">;
type UpdateSubscription = Omit<Subscription, "createdAt">;

export {
  /**Payment types */
  OrderStatus,
  PaymentOrder,
  CapturedOrder,
  OrderStatusResponse,
  /** Customer types */
  GatewayCustomerReference,
  /** Subscription plans and packages */
  PaymentFrecuency,
  SubscriptionStatus,
  ProductDetails,
  CreatePackage,
  CreateSubscriptionPlan,
  UpdatePackage,
  UpdateSubscriptionPlan,
  UpdateSubscriptionPlan,
  /** User subscriptions */
  SubscriptionHistory,
  CreateSubscription,
  UpdateSubscription,
};
