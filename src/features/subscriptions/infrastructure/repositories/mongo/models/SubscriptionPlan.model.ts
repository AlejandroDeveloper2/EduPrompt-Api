import { model, Schema } from "mongoose";

import { LangTemplate } from "@/core/domain/types";

import { SubscriptionPlan } from "@/features/subscriptions/domain/entities";

export interface MongoSubscriptionPlan extends Omit<
  SubscriptionPlan,
  "subscriptionPlanId"
> {
  _id: string;
}

export const LangTemplateSchema = new Schema<LangTemplate<string>>(
  {
    en: { type: String, required: true },
    es: { type: String, required: true },
    pt: { type: String, required: true },
  },
  { _id: false, timestamps: false, versionKey: false },
);

export const LangTemplateArraySchema = new Schema<LangTemplate<string[]>>(
  {
    en: { type: [String], required: true },
    es: { type: [String], required: true },
    pt: { type: [String], required: true },
  },
  { _id: false, timestamps: false, versionKey: false },
);

const SubscriptionPlanSchema = new Schema<MongoSubscriptionPlan>({
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
});

export const SubscriptionPlanModel = model(
  "subscription_plans",
  SubscriptionPlanSchema,
);
