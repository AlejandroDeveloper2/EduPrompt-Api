import { Router } from "express";

import { apiKeyGuard, validateDTO } from "@/core/infrastructure/middlewares";

import { commentsController, mediaAssetsController } from "../../controllers";

import {
  CommentFiltersDto,
  CreateCommentDto,
} from "@/features/landing/application/dto";

const router = Router();

/** Endpoints para el módulo de landing */
router
  .get(
    "/comments",
    apiKeyGuard(["landing:read"]),
    validateDTO(CommentFiltersDto, "query"),
    commentsController.getComments,
  )
  .post(
    "/comments",
    apiKeyGuard(["landing:write"]),
    validateDTO(CreateCommentDto, "body"),
    commentsController.postComment,
  )
  .get(
    "/media/screenshots",
    apiKeyGuard(["landing:read"]),
    mediaAssetsController.getScreenshots,
  )
  .get(
    "/media/demo-video",
    apiKeyGuard(["landing:read"]),
    mediaAssetsController.getDemoVideoUrl,
  )
  .get(
    "/media/tutorial-video",
    apiKeyGuard(["landing:read"]),
    mediaAssetsController.getTutorialVideoUrl,
  );

export { router };
