import { z } from "zod/v4";

import { objectIdSchema } from "@/shared/dtos/objectIdSchema.dto";
import {
  LangArrayTemplateDto,
  LangTemplateDto,
} from "./updateTokenPackage.dto";

/** Dto de salida */
export const TokenPackageDto = z.object({
  packageId: objectIdSchema,
  title: LangTemplateDto,
  description: LangTemplateDto,
  benefits: LangArrayTemplateDto,
  price: z.number().nonnegative(),
  tokenAmount: z.number().nonnegative(),
});

export type TokenPackageOutput = z.infer<typeof TokenPackageDto>;
