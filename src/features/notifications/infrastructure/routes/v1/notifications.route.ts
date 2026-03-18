import { Router } from "express";

import {
  adminAuthMiddleware,
  apiKeyGuard,
  validateDTO,
} from "@/core/infrastructure/middlewares";

import {
  CreateNotificationDto,
  ListNotificationsFilterDto,
  NotificationIdParamDto,
  UpdateNotificationDto,
  DeleteNotificationsByIdDto,
  MarkAsReadNotificationsDto,
} from "../../../application/dto";

import { notificationController } from "../../controllers/Notifications.controller";

const router = Router();

/** Endpoints para el módulo de notificaciones de sistema solo admin.*/
router
  .post(
    "/admin",
    apiKeyGuard(["admin:write", "notifications:write"]),
    adminAuthMiddleware,
    validateDTO(CreateNotificationDto, "body"),
    notificationController.postNotification,
  )
  .put(
    "/admin/:notificationId",
    apiKeyGuard(["admin:write", "notifications:write"]),
    adminAuthMiddleware,
    validateDTO(NotificationIdParamDto, "params"),
    validateDTO(UpdateNotificationDto, "body"),
    notificationController.putNotification,
  )
  .delete(
    "/admin",
    apiKeyGuard(["admin:write", "notifications:write"]),
    adminAuthMiddleware,
    validateDTO(DeleteNotificationsByIdDto, "body"),
    notificationController.deleteManyNotifications,
  );

/** Endpoints para el módulo de notificaciones de sistema para usuarios. */
router
  .get(
    "/",
    apiKeyGuard(["notifications:read"]),
    validateDTO(ListNotificationsFilterDto, "query"),
    notificationController.getNotifications,
  )
  .get(
    "/:notificationId",
    apiKeyGuard(["notifications:read"]),
    validateDTO(NotificationIdParamDto, "params"),
    notificationController.getNotificationById,
  )
  .patch(
    "/",
    apiKeyGuard(["notifications:write"]),
    validateDTO(MarkAsReadNotificationsDto, "body"),
    notificationController.patchNotificationsReadStatus,
  );

export { router };
