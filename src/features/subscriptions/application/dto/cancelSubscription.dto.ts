import z from "zod/v4";

export const CurrentHistoryIdParamDto = z.object({
  currentHistoryId: z.uuidv4(),
});
