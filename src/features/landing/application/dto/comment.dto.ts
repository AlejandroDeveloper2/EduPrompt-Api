import { z } from "zod/v4";

import { objectIdSchema } from "@/shared/dtos/objectIdSchema.dto";

export const CommentFiltersDto = z.object({
  page: z
    .string()
    .optional()
    .refine((val) => !val || parseInt(val) >= 0),
  limit: z
    .string()
    .optional()
    .refine((val) => !val || parseInt(val) > 0),
});

/* DTOs de salida (request)*/
export const CommentDto = z.object({
  commentId: objectIdSchema,
  commentContent: z.string().min(1),
  userFullname: z.string().min(1),
  createdAt: z.coerce.date(),
});

export type CommentFiltersInput = z.infer<typeof CommentFiltersDto>;
/** Tipos de salida */
export type CommentOutput = z.infer<typeof CommentDto>;
