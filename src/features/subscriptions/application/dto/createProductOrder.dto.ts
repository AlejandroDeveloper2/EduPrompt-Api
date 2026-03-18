import { z } from "zod/v4";

import { objectIdSchema } from "@/shared/dtos/objectIdSchema.dto";

export const CreateProductOrderDto = z.object({
  productId: objectIdSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  productType: z.enum(["subscription", "token_package"]),
  language: z.enum(["en", "es", "pt"]).optional(),
  tokenAmount: z.number().nonnegative().optional(),
});

export type CreateProductOrderInput = z.infer<typeof CreateProductOrderDto>;
