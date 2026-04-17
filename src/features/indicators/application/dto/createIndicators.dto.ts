import { z } from "zod/v4";

/** Dto de entrada */
export const CreateIndicatorsDto = z.object({
  generatedResources: z.number().min(0),
  usedTokens: z.number().min(0),
  lastGeneratedResource: z.string().nullable(),
  dowloadedResources: z.number().min(0),
  savedResources: z.number().min(0),
});

/** Tipos de entrada */
export type CreateIndicatorInput = z.infer<typeof CreateIndicatorsDto>;
