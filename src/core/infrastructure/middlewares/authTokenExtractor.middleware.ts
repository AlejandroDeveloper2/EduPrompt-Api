import { NextFunction, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

import { RequestExtended } from "../types";
import { DecodedToken } from "@/core/domain/types";

import { config } from "@/config/enviromentVariables";
import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

/**
 * Middleware que extrae y valida el token JWT de autorización si está presente.
 *
 * Comprueba el encabezado `Authorization` y, si existe un token, lo decodifica
 * (ignorando la expiración) y añade el objeto resultante a `req.user` para que
 * pueda ser utilizado por siguientes middlewares o rutas. Si el token está
 * malformado o inválido se dispara un `AppError` adecuado.
 *
 * @param req - petición extendida donde se puede inyectar el usuario decodificado.
 * @param res - respuesta express (no se modifica aquí).
 * @param next - función next para continuar la cadena de middlewares.
 *
 * @remarks
 *   - No detiene la cadena si no existe token, simplemente avanza.
 *   - En caso de error de JWT o de aplicación devuelve un error con código 401 o 500.
 */
export const authTokenExtractorMiddleware = (
  req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader?.split(" ")[1];

  /** Validamos el token de sesión si este existe en los
   * headers en caso de que el usuario esté logueado en caso contrario pasamos al siguiente paso*/
  try {
    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET, {
        ignoreExpiration: true,
      }) as DecodedToken;

      req.user = decoded;
    }
    next();
  } catch (error: unknown) {
    if (error instanceof JsonWebTokenError)
      return next(
        new AppError(
          ErrorMessages.INVALID_TOKEN,
          401,
          "Session token is invalid or malformed",
          true,
          error,
        ),
      );
    if (error instanceof AppError)
      return next(
        new AppError(
          error.name,
          error.httpCode,
          error.message,
          error.isOperational,
          error,
        ),
      );
    next(
      new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "Unknown error while validating session token",
        false,
        error,
      ),
    );
  }
};
