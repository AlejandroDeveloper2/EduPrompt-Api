import { z } from "zod/v4";

import { CreateProductOrderDto } from "./createProductOrder.dto";

export const CaptureProductOrderDto = z.object({
  orderId: z.string(),
  productDetails: CreateProductOrderDto,
});

export type CaptureProductOrderInput = z.infer<typeof CaptureProductOrderDto>;
