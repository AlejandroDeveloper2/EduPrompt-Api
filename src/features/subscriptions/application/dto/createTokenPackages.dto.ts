import { z } from "zod/v4";

import {
  LangArrayTemplateDto,
  LangTemplateDto,
} from "./updateTokenPackage.dto";

export const CreateTokenPackagesDto = z.object({
  packages: z
    .array(
      z.object({
        title: LangTemplateDto,
        description: LangTemplateDto,
        benefits: LangArrayTemplateDto,
        price: z.number().nonnegative(),
        tokenAmount: z.number().nonnegative(),
      }),
    )
    .min(1),
});

export type CreateTokenPackagesInput = z.infer<typeof CreateTokenPackagesDto>;
