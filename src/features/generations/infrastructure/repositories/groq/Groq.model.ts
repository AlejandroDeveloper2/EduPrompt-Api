import OpenAI from "openai";
import { InferenceClient } from "@huggingface/inference";

import { config } from "@/config/enviromentVariables";

export const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: config.GROQ_IA_API_KEY,
});

export const huggingFace = new InferenceClient(config.HF_TOKEN);
