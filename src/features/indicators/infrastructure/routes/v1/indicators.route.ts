import { Router } from "express";

import {
  apiKeyGuard,
  authMiddleware,
  validateDTO,
} from "@/core/infrastructure/middlewares";

import {
  UpdateIndicatorsDto,
  SyncIndicatorsDto,
} from "../../../application/dto";

import { indicatorsController } from "../../controllers/Indicators.controller";

const router = Router();

/** Endpoints para el módulo de Indicadores */
router
  .get(
    "/",
    apiKeyGuard(["indicators:read"]),
    authMiddleware,
    indicatorsController.getIndicators,
  )
  .patch(
    "/",
    apiKeyGuard(["indicators:write"]),
    validateDTO(UpdateIndicatorsDto, "body"),
    authMiddleware,
    indicatorsController.patchIndicators,
  )
  .put(
    "/",
    apiKeyGuard(["indicators:write"]),
    validateDTO(SyncIndicatorsDto, "body"),
    authMiddleware,
    indicatorsController.putIndicators,
  );

export { router };
