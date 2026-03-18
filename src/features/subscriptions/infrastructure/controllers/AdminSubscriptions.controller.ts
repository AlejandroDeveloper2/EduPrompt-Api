import { Request, Response, NextFunction } from "express";

import { handleHttp } from "@/shared/utils";

import {
  CreateSubscriptionPlansInput,
  CreateTokenPackagesInput,
  DeleteSubscriptionPlansInput,
  DeleteTokenPackagesInput,
  UpdateSubscriptionPlanInput,
  UpdateTokenPackageInput,
} from "../../application/dto";

import { SubscriptionsServiceContainer } from "../containers";

const subscriptionsServiceContainer = new SubscriptionsServiceContainer();

class AdminSubscriptionsController {
  async postSubscriptionPlans(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payload = req.body as CreateSubscriptionPlansInput;
      await subscriptionsServiceContainer.createSubscriptionPlans.run(payload);
      handleHttp(
        res,
        { data: null, message: "Subscription plans created successfully!" },
        201,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  async postTokenPackages(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payload = req.body as CreateTokenPackagesInput;
      await subscriptionsServiceContainer.createTokenPackages.run(payload);
      handleHttp(
        res,
        { data: null, message: "Token packages created successfully!" },
        201,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  async putSubscriptionPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payload = req.body as UpdateSubscriptionPlanInput;
      const { planId } = req.params;

      await subscriptionsServiceContainer.updateSubscriptionPlan.run(
        planId as string,
        payload,
      );
      handleHttp(
        res,
        { data: null, message: "Subscription plan updated successfully!" },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  async putTokenPackage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payload = req.body as UpdateTokenPackageInput;
      const { packageId } = req.params;

      await subscriptionsServiceContainer.updateTokenPackage.run(
        packageId as string,
        payload,
      );
      handleHttp(
        res,
        { data: null, message: "Token package updated successfully!" },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteSubscriptionPlans(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payload = req.body as DeleteSubscriptionPlansInput;

      await subscriptionsServiceContainer.deleteSubscriptionPlans.run(payload);

      handleHttp(
        res,
        { data: null, message: "Subscription plans deleted successfully!" },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteTokenPackages(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payload = req.body as DeleteTokenPackagesInput;

      await subscriptionsServiceContainer.deleteTokenPackages.run(payload);

      handleHttp(
        res,
        { data: null, message: "Token packages deleted successfully!" },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const adminSubscriptionsController = new AdminSubscriptionsController();
