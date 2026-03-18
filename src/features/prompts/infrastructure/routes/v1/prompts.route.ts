import { Router } from "express";

import {
  apiKeyGuard,
  authMiddleware,
  validateDTO,
} from "@/core/infrastructure/middlewares";

import {
  CreatePromptDto,
  PromptsFiltersDto,
  PromptIdParamDto,
  UpdatePromptDto,
  DeletePromptsByIdDto,
  SyncPromptsDto,
} from "../../../application/dto";

import { promptController } from "../../controllers/Prompts.controller";

const router = Router();

/** Endpoints para el módulo de prompts */
router
  .post(
    "/",
    apiKeyGuard(["prompts:write"]),
    validateDTO(CreatePromptDto, "body"),
    authMiddleware,
    promptController.postPrompt,
  )
  .get(
    "/",
    apiKeyGuard(["prompts:read"]),
    validateDTO(PromptsFiltersDto, "query"),
    authMiddleware,
    promptController.getPromptsByUser,
  )
  .get(
    "/:promptId",
    apiKeyGuard(["prompts:read"]),
    validateDTO(PromptIdParamDto, "params"),
    authMiddleware,
    promptController.getPromptById,
  )
  .put(
    "/:promptId",
    apiKeyGuard(["prompts:write"]),
    validateDTO(PromptIdParamDto, "params"),
    validateDTO(UpdatePromptDto, "body"),
    authMiddleware,
    promptController.putPrompt,
  )
  .delete(
    "/",
    apiKeyGuard(["prompts:write"]),
    validateDTO(DeletePromptsByIdDto, "body"),
    authMiddleware,
    promptController.deleteManyPrompts,
  )
  .post(
    "/sync",
    apiKeyGuard(["prompts:write"]),
    validateDTO(SyncPromptsDto, "body"),
    authMiddleware,
    promptController.postSyncPrompts,
  );

export { router };
