import { z } from "zod/v4";

import { objectIdSchema } from "@/shared/dtos/objectIdSchema.dto";

export const LangTemplateDto = z.object({
  en: z.string().min(1),
  es: z.string().min(1),
  pt: z.string().min(1),
});

export const LangArrayTemplateDto = z.object({
  en: z.array(z.string().min(1)).min(1),
  es: z.array(z.string().min(1)).min(1),
  pt: z.array(z.string().min(1)).min(1),
});

export const TokenPackageIdParamDto = z.object({
  packageId: objectIdSchema,
});

export const UpdateTokenPackageDto = z.object({
  title: LangTemplateDto,
  description: LangTemplateDto,
  benefits: LangArrayTemplateDto,
  price: z.number().nonnegative(),
  tokenAmount: z.number().nonnegative(),
});

export type UpdateTokenPackageInput = z.infer<typeof UpdateTokenPackageDto>;
