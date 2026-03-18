import z from "zod/v4";

import {
  LangTemplateDto,
  LangArrayTemplateDto,
} from "./updateTokenPackage.dto";

export const CreateSubscriptionPlansDto = z.object({
  plans: z
    .array(
      z.object({
        title: LangTemplateDto,
        description: LangTemplateDto,
        benefits: LangArrayTemplateDto,
        paymentFrecuency: z.enum(["monthly", "yearly"]),
        price: z.number().nonnegative(),
      }),
    )
    .min(1),
});

export type CreateSubscriptionPlansInput = z.infer<
  typeof CreateSubscriptionPlansDto
>;
