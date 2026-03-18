import { Router } from "express";

import {
  adminAuthMiddleware,
  apiKeyGuard,
  authMiddleware,
  authTokenExtractorMiddleware,
  validateDTO,
} from "@/core/infrastructure/middlewares";

import {
  CaptureProductOrderDto,
  CreateProductOrderDto,
  CreateSubscriptionPlansDto,
  CreateTokenPackagesDto,
  CurrentHistoryIdParamDto,
  DeleteSubscriptionPlansDto,
  DeleteTokenPackagesDto,
  OrderIdDto,
  SubscriptionIdParamDto,
  SubscriptionPlanIdParamDto,
  TokenPackageIdParamDto,
  UpdateSubscriptionPlanDto,
  UpdateTokenPackageDto,
} from "@/features/subscriptions/application/dto";

import {
  adminSubscriptionsController,
  subscriptionsController,
} from "../../controllers";

const router = Router();

/** Endpoints para admin del módulo de suscripciones */
router
  .post(
    "/admin/plans",
    apiKeyGuard(["admin:write", "subscriptions:write"]),
    adminAuthMiddleware,
    validateDTO(CreateSubscriptionPlansDto, "body"),
    adminSubscriptionsController.postSubscriptionPlans,
  )
  .post(
    "/admin/packages",
    apiKeyGuard(["admin:write", "subscriptions:write"]),
    adminAuthMiddleware,
    validateDTO(CreateTokenPackagesDto, "body"),
    adminSubscriptionsController.postTokenPackages,
  )
  .put(
    "/admin/plans/:planId",
    apiKeyGuard(["admin:write", "subscriptions:write"]),
    adminAuthMiddleware,
    validateDTO(SubscriptionPlanIdParamDto, "params"),
    validateDTO(UpdateSubscriptionPlanDto, "body"),
    adminSubscriptionsController.putSubscriptionPlan,
  )
  .put(
    "/admin/packages/:packageId",
    apiKeyGuard(["admin:write", "subscriptions:write"]),
    adminAuthMiddleware,
    validateDTO(TokenPackageIdParamDto, "params"),
    validateDTO(UpdateTokenPackageDto, "body"),
    adminSubscriptionsController.putTokenPackage,
  )
  .delete(
    "/admin/plans",
    apiKeyGuard(["admin:write", "subscriptions:write"]),
    adminAuthMiddleware,
    validateDTO(DeleteSubscriptionPlansDto, "body"),
    adminSubscriptionsController.deleteSubscriptionPlans,
  )
  .delete(
    "/admin/packages",
    apiKeyGuard(["admin:write", "subscriptions:write"]),
    adminAuthMiddleware,
    validateDTO(DeleteTokenPackagesDto, "body"),
    adminSubscriptionsController.deleteTokenPackages,
  );

/** Endpoints para usuarios del módulo de suscripciones */
router
  .get(
    "/plans",
    apiKeyGuard(["subscriptions:read"]),
    subscriptionsController.getSubscriptionPlans,
  )
  .get(
    "/packages",
    apiKeyGuard(["subscriptions:read"]),
    subscriptionsController.getTokenPackages,
  )
  .post(
    "/orders",
    apiKeyGuard(["subscriptions:write"]),
    validateDTO(CreateProductOrderDto, "body"),
    subscriptionsController.postProductOrder,
  )
  .post(
    "/orders/capture",
    apiKeyGuard(["subscriptions:write"]),
    authTokenExtractorMiddleware,
    validateDTO(CaptureProductOrderDto, "body"),
    subscriptionsController.postCaptureOrder,
  )
  .get(
    "/",
    apiKeyGuard(["subscriptions:read"]),
    authMiddleware,
    subscriptionsController.getSubscriptionByUser,
  )
  .patch(
    "/:subscriptionId/:currentHistoryId",
    apiKeyGuard(["subscriptions:write"]),
    authMiddleware,
    validateDTO(SubscriptionIdParamDto, "params"),
    validateDTO(CurrentHistoryIdParamDto, "params"),
    subscriptionsController.patchSubscriptionCancellation,
  )
  .get(
    "/orders/:orderId/status",
    apiKeyGuard(["subscriptions:read"]),
    validateDTO(OrderIdDto, "params"),
    subscriptionsController.getOrderStatus,
  )
  .patch(
    "/retry/:subscriptionId/:orderId",
    apiKeyGuard(["subscriptions:write"]),
    authMiddleware,
    validateDTO(SubscriptionIdParamDto, "params"),
    validateDTO(OrderIdDto, "params"),
    subscriptionsController.patchSubscriptionPayment,
  );

export { router };
