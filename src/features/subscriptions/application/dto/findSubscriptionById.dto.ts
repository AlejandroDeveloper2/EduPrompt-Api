import { z } from "zod/v4";

import { objectIdSchema } from "@/shared/dtos/objectIdSchema.dto";
import {
  LangTemplateDto,
  LangArrayTemplateDto,
} from "./updateTokenPackage.dto";

export const SubscriptionIdParamDto = z.object({
  subscriptionId: objectIdSchema,
});

/** Dto de salida */
export const SubscriptionDto = z.object({
  subscriptionId: objectIdSchema,
  history: z.array(
    z.object({
      historyId: z.uuidv4(),
      plan: z.object({
        subscriptionPlanId: objectIdSchema,
        title: LangTemplateDto,
        description: LangTemplateDto,
        benefits: LangArrayTemplateDto,
        paymentFrecuency: z.enum(["monthly", "yearly"]),
        price: z.number().nonnegative(),
      }),
      status: z.enum(["cancelled", "active", "inactive", "failed"]),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    }),
  ),
  currentHistoryId: z.uuidv4(),
});

export type SubscriptionOutput = z.infer<typeof SubscriptionDto>;
