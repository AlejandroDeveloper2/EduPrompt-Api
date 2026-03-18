import { z } from "zod/v4";

import { objectIdSchema } from "@/shared/dtos/objectIdSchema.dto";

export const DeleteTokenPackagesDto = z.object({
  packageIds: z.array(objectIdSchema).min(1),
});

export type DeleteTokenPackagesInput = z.infer<typeof DeleteTokenPackagesDto>;
