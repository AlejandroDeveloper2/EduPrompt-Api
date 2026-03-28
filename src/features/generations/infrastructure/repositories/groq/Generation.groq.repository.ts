import { AppError } from "@/core/domain/exeptions/AppError";

import { Generation } from "@/features/generations/domain/entities";
import { GenerationRepositoryType } from "@/features/generations/domain/repositories/GenerationRepository.interface";

import { ErrorMessages } from "@/shared/utils";

import { groq, huggingFace } from "./Groq.model";

export class GenerationGroqRepository implements GenerationRepositoryType {
  async generateTextResource(
    assistantInstructions: string,
    userPrompt: string,
  ): Promise<Generation> {
    try {
      const { output_text, created_at } = await groq.responses.create({
        model: "llama-3.3-70b-versatile",
        instructions: assistantInstructions,
        input: userPrompt,
      });
      return {
        result: output_text,
        generationDate: new Date(created_at),
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error ocurred while proccesing generation",
        false,
        error,
      );
    }
  }

  async generateImageResource(
    processedPrompt: string,
  ): Promise<Generation | null> {
    try {
      const imageResult = await huggingFace.textToImage({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        inputs: processedPrompt,
        parameters: {
          negative_prompt:
            "blurry, low quality, nsfw, violence, watermark, text, logo",
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      });

      const blob = new Blob([imageResult]);

      // Convertir Blob → Base64
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      return {
        result: base64,
        generationDate: new Date(),
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error ocurred while proccesing image generation",
        false,
        error,
      );
    }
  }
}
