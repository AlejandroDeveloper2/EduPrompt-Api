import { Router } from "express";

import {
  apiKeyGuard,
  authMiddleware,
  validateDTO,
} from "@/core/infrastructure/middlewares";

import {
  CreateResourceDto,
  ResourcesFiltersDto,
  ResourceIdParamDto,
  DeleteResourcesByIdDto,
  SyncResourcesDto,
  UpdateResourceDto,
} from "../../../application/dto";

import { educationalResourceController } from "../../controllers/EducationalResources.controller";

const router = Router();

/** Endpoints para el módulo de recursos educativos */
router
  .post(
    "/",
    apiKeyGuard(["resources:write"]),
    validateDTO(CreateResourceDto, "body"),
    authMiddleware,
    educationalResourceController.postEducationalResource,
  )
  .get(
    "/",
    apiKeyGuard(["resources:read"]),
    validateDTO(ResourcesFiltersDto, "query"),
    authMiddleware,
    educationalResourceController.getEducationalResourcesByUser,
  )
  .get(
    "/:resourceId",
    apiKeyGuard(["resources:read"]),
    validateDTO(ResourceIdParamDto, "params"),
    authMiddleware,
    educationalResourceController.getEducationalResourceById,
  )
  .patch(
    "/:resourceId",
    apiKeyGuard(["resources:write"]),
    validateDTO(ResourceIdParamDto, "params"),
    validateDTO(UpdateResourceDto, "body"),
    authMiddleware,
    educationalResourceController.patchResource,
  )
  .delete(
    "/",
    apiKeyGuard(["resources:write"]),
    validateDTO(DeleteResourcesByIdDto, "body"),
    authMiddleware,
    educationalResourceController.deleteManyResources,
  )
  .post(
    "/sync",
    apiKeyGuard(["resources:write"]),
    validateDTO(SyncResourcesDto, "body"),
    authMiddleware,
    educationalResourceController.postSyncResources,
  );

export { router };
