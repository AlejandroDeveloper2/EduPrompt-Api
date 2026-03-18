import { model, Schema } from "mongoose";

import { Subscription, SubscriptionPlan } from "../../../../domain/entities";
import {
  GatewayCustomerReference,
  SubscriptionHistory,
} from "@/features/subscriptions/domain/types";

import {
  LangTemplateArraySchema,
  LangTemplateSchema,
  MongoSubscriptionPlan,
} from "./SubscriptionPlan.model";

interface MongoHistory extends Omit<SubscriptionHistory, "plan"> {
  plan: MongoSubscriptionPlan;
}

export interface MongoSubscription extends Omit<
  Subscription,
  "subscriptionId"
> {
  _id: string;
}

const PlanSchema = new Schema<SubscriptionPlan>(
  {
    subscriptionPlanId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: LangTemplateSchema,
      required: true,
    },
    description: {
      type: LangTemplateSchema,
      required: true,
    },
    benefits: {
      type: LangTemplateArraySchema,
      required: true,
    },
    paymentFrecuency: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: false, versionKey: false, _id: false },
);

const SubscriptionHistorySchema = new Schema<MongoHistory>(
  {
    historyId: {
      type: String,
      required: true,
    },
    plan: {
      type: PlanSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ["cancelled", "active", "inactive", "failed"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: false, versionKey: false, _id: false },
);

const GatewayCustomerReferenceSchema = new Schema<GatewayCustomerReference>(
  {
    gateway: {
      type: String,
      enum: ["paypal", "stripe", "mercadopago"],
      required: true,
    },
    vaultId: {
      type: String,
      required: false,
      default: null,
    },
    customerId: {
      type: String,
    },
    paymentMethodId: {
      type: String,
    },
    gatewayRawData: {
      type: Object,
      required: true,
    },
  },
  { timestamps: false, _id: false, versionKey: false },
);

/** Esquema de suscripción en mongo db */
const SubscriptionSchema = new Schema<MongoSubscription>(
  {
    history: {
      type: [SubscriptionHistorySchema],
      required: true,
    },
    gatewayCustomerReference: {
      type: GatewayCustomerReferenceSchema,
      required: true,
    },
    language: {
      type: String,
      enum: ["en", "es", "pt"],
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    currentHistoryId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export const SubscriptionModel = model("subscriptions", SubscriptionSchema);
