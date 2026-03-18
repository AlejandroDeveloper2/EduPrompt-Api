import { Request, Response, NextFunction } from "express";

import { RequestExtended } from "@/core/infrastructure/types";
import { handleHttp } from "@/shared/utils";

import {
  toSubscriptionOutputDto,
  toSubscriptionPlanOutputDto,
  toTokenPackageOutputDto,
} from "../../application/mappers";

import { SubscriptionsServiceContainer } from "../containers";
import {
  CaptureProductOrderInput,
  CreateProductOrderInput,
} from "../../application/dto";

const subscriptionsServiceContainer = new SubscriptionsServiceContainer();

/**
 * Controlador HTTP para gestionar suscripciones, planes de suscripción,
 * paquetes de tokens y órdenes de pago.
 * Maneja las solicitudes entrantes y delega la lógica de negocio al
 * contenedor de servicios de suscripciones.
 */
class SubscriptionsController {
  /**
   * Obtiene los planes de suscripción disponibles.
   * Traduce los campos según el encabezado Accept-Language y devuelve DTOs listos para respuesta.
   * @param req Solicitud de Express (usa Accept-Language para la localización).
   * @param res Respuesta de Express.
   * @param next Siguiente middleware para el manejo de errores.
   * @returns Promise<void>
   */
  async getSubscriptionPlans(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plans =
        await subscriptionsServiceContainer.findSubscriptionPlans.run();

      handleHttp(
        res,
        {
          data: plans.map((plan) => toSubscriptionPlanOutputDto(plan)),
          message: "Subscription plans loaded successfully!",
        },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Obtiene los paquetes de tokens disponibles.
   * Traduce los campos según el encabezado Accept-Language y devuelve DTOs listos para respuesta.
   * @param req Solicitud de Express (usa Accept-Language para la localización).
   * @param res Respuesta de Express.
   * @param next Siguiente middleware para el manejo de errores.
   * @returns Promise<void>
   */
  async getTokenPackages(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const packages =
        await subscriptionsServiceContainer.findTokenPackages.run();

      handleHttp(
        res,
        {
          data: packages.map((tokenPackage) =>
            toTokenPackageOutputDto(tokenPackage),
          ),
          message: "Token packages loaded successfully!",
        },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Crea una orden de producto (plan o paquete) con el proveedor de pagos.
   * @param req Cuerpo con CreateProductOrderInput.
   * @param res Respuesta de Express.
   * @param next Siguiente middleware para el manejo de errores.
   * @returns Promise<void>
   */
  async postProductOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payload = req.body as CreateProductOrderInput;

      const result =
        await subscriptionsServiceContainer.createProductOrder.run(payload);

      handleHttp(
        res,
        {
          data: result,
          message: "Order created successfully!",
        },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Captura y completa una orden previamente creada, asociándola al usuario autenticado.
   * @param req Solicitud extendida con el usuario (req.user) y cuerpo con CaptureProductOrderInput.
   * @param res Respuesta de Express.
   * @param next Siguiente middleware para el manejo de errores.
   * @returns Promise<void>
   */
  async postCaptureOrder(
    req: RequestExtended,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: undefined };
      const payload = req.body as CaptureProductOrderInput;

      await subscriptionsServiceContainer.captureProductOrder.run(
        payload,
        userId,
      );

      handleHttp(
        res,
        {
          data: null,
          message: "Order captured and completed successfully!",
        },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Obtiene una suscripción por el identificador del usuario propietario.
   * @param req Parámetros con userId.
   * @param res Respuesta de Express.
   * @param next Siguiente middleware para el manejo de errores.
   * @returns Promise<void>
   */
  async getSubscriptionByUser(
    req: RequestExtended,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };

      const subscription =
        await subscriptionsServiceContainer.findSubscriptionByUser.run(userId);

      console.log(subscription);

      handleHttp(
        res,
        {
          data: toSubscriptionOutputDto(subscription),
          message: "Subscription loaded successfully!",
        },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Cancela una suscripción activa del usuario.
   * @param req Parámetros con subscriptionId y currentHistoryId; usuario autenticado en req.user.
   * @param res Respuesta de Express.
   * @param next Siguiente middleware para el manejo de errores.
   * @returns Promise<void>
   */
  async patchSubscriptionCancellation(
    req: RequestExtended,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const { subscriptionId, currentHistoryId } = req.params;

      await subscriptionsServiceContainer.cancelSubscription.run(
        subscriptionId as string,
        currentHistoryId as string,
        userId,
      );

      handleHttp(
        res,
        {
          data: null,
          message: "Subscription has been cancelled successfully!",
        },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Consulta el estado actual de una orden de pago por su ID.
   * @param req Parámetros con orderId.
   * @param res Respuesta de Express.
   * @param next Siguiente middleware para el manejo de errores.
   * @returns Promise<void>
   */
  async getOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;

      const orderStatus =
        await subscriptionsServiceContainer.findOrderStatus.run(
          orderId as string,
        );

      handleHttp(
        res,
        {
          data: orderStatus,
          message: "Order was found successfully!",
        },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Reintenta el pago y reactiva una suscripción fallida o cancelada del usuario.
   * @param req Parámetros con subscriptionId y orderId.
   * @param res Respuesta de Express.
   * @param next Siguiente middleware para el manejo de errores.
   * @returns Promise<void>
   */
  async patchSubscriptionPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { subscriptionId, orderId } = req.params;

      await subscriptionsServiceContainer.retrySubscriptionPayment.run(
        subscriptionId as string,
        orderId as string,
      );

      handleHttp(
        res,
        {
          data: null,
          message: "Subscription has been reactivated successfully!",
        },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const subscriptionsController = new SubscriptionsController();
