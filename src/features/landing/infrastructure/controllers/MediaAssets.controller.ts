import { NextFunction, Request, Response } from "express";

import { MediaAssetsServiceContainer } from "../containers";

import { handleHttp } from "@/shared/utils";

const mediaAssetsServiceContainer = new MediaAssetsServiceContainer();

class MediaAssetsController {
  /**
   * Retorna las URLs de capturas de pantalla de la aplicación.
   *
   * @param {Request} req - Objeto de solicitud de Express.
   * @param {Response} res - Objeto de respuesta de Express.
   * @param {NextFunction} next - Función next para el manejo de errores middleware.
   * @returns {Promise<void>} Envía respuesta HTTP 200 con las URLs de las imágenes.
   */
  async getScreenshots(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const mediaUrls = await mediaAssetsServiceContainer.getScreenshots.run();
      handleHttp(
        res,
        {
          data: mediaUrls,
          message: "¡Capturas de pantalla cargadas con éxito!",
        },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Retorna la URL del video de demostración.
   *
   * @param {Request} req - Objeto de solicitud de Express.
   * @param {Response} res - Objeto de respuesta de Express.
   * @param {NextFunction} next - Función next para el manejo de errores middleware.
   * @returns {Promise<void>} Envía respuesta HTTP 200 con la URL del video de demo.
   */
  async getDemoVideoUrl(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const mediaUrl = await mediaAssetsServiceContainer.getDemoVideoUrl.run();
      handleHttp(
        res,
        {
          data: mediaUrl,
          message: "¡Video de demostración cargado con éxito!",
        },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Retorna la URL del video tutorial de instalación.
   *
   * @param {Request} req - Objeto de solicitud de Express.
   * @param {Response} res - Objeto de respuesta de Express.
   * @param {NextFunction} next - Función next para el manejo de errores middleware.
   * @returns {Promise<void>} Envía respuesta HTTP 200 con la URL del video tutorial.
   */
  async getTutorialVideoUrl(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const mediaUrl =
        await mediaAssetsServiceContainer.getTutorialVideoUrl.run();
      handleHttp(
        res,
        {
          data: mediaUrl,
          message: "¡Video tutorial de instalación cargado con éxito!",
        },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const mediaAssetsController = new MediaAssetsController();
