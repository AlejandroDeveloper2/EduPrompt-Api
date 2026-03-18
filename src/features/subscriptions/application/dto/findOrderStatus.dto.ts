import { z } from "zod/v4";

export const OrderIdDto = z.object({
  orderId: z.string().min(17).max(17),
});
