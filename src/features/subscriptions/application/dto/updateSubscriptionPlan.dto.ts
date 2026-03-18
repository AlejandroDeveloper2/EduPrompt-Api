import z from "zod/v4";

import { objectIdSchema } from "@/shared/dtos/objectIdSchema.dto";
import {
  LangArrayTemplateDto,
  LangTemplateDto,
} from "./updateTokenPackage.dto";

export const SubscriptionPlanIdParamDto = z.object({
  planId: objectIdSchema,
});

export const UpdateSubscriptionPlanDto = z.object({
  title: LangTemplateDto,
  description: LangTemplateDto,
  benefits: LangArrayTemplateDto,
  paymentFrecuency: z.enum(["monthly", "yearly"]),
  price: z.number().nonnegative(),
});

export type UpdateSubscriptionPlanInput = z.infer<
  typeof UpdateSubscriptionPlanDto
>;
