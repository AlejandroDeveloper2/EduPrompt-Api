import { model, Schema } from "mongoose";

import { TokenPackage } from "@/features/subscriptions/domain/entities";

import {
  LangTemplateSchema,
  LangTemplateArraySchema,
} from "./SubscriptionPlan.model";

interface MongoTokenPackage extends Omit<TokenPackage, "packageId"> {
  _id: string;
}

export const TokenPackageSchema = new Schema<MongoTokenPackage>({
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
  price: {
    type: Number,
    required: true,
  },
  tokenAmount: {
    type: Number,
    required: true,
  },
});

export const TokenPackageModel = model("token_packages", TokenPackageSchema);
