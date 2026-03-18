import { z } from "zod/v4";

import { objectIdSchema } from "@/shared/dtos/objectIdSchema.dto";
import {
  LangArrayTemplateDto,
  LangTemplateDto,
} from "./updateTokenPackage.dto";

/** Dto de salida */
export const SubscriptionPlanDto = z.object({
  subscriptionPlanId: objectIdSchema,
  title: LangTemplateDto,
  description: LangTemplateDto,
  benefits: LangArrayTemplateDto,
  paymentFrecuency: z.enum(["monthly", "yearly"]),
  price: z.number().nonnegative(),
});

export type SubscriptionPlanOutput = z.infer<typeof SubscriptionPlanDto>;
