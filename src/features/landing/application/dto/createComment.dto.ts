import { z } from "zod/v4";

/* DTOs de entrada (request)*/
export const CreateCommentDto = z.object({
  commentContent: z.string().min(1),
  userFullname: z.string().min(1),
});

/** Tipos de entrada */
export type CreateCommentInput = z.infer<typeof CreateCommentDto>;
