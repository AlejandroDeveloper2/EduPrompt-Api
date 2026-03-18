import { z } from "zod/v4";

import { objectIdSchema } from "@/shared/dtos/objectIdSchema.dto";

export const DeleteSubscriptionPlansDto = z.object({
  planIds: z.array(objectIdSchema).min(1),
});

export type DeleteSubscriptionPlansInput = z.infer<
  typeof DeleteSubscriptionPlansDto
>;
