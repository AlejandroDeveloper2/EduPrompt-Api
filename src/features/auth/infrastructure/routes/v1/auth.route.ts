import { Router } from "express";

import { authController } from "../../controllers/Auth.controller";

import {
  validateDTO,
  authMiddleware,
  apiKeyGuard,
  softAuthMiddleware,
} from "@/core/infrastructure/middlewares";

import { UserIdParamDto } from "@/shared/dtos/userIdParam.dto";
import {
  LoginDto,
  ResetUserPasswordDto,
  RecoveryPasswordRequestDto,
  ValidateResetPassCodeDto,
  RegisterDto,
  ResendEmailVerificationCodeDto,
  ValidateCodeAndUpdateEmailDto,
  SendEmailChangeRequestDto,
  ChangeUserPasswordDto,
  ValidateEmailVerificationCodeDto,
} from "../../../application/dto";

const router = Router();

/** Endpoints para el módulo de autentificación */
// Endpoints públicos
router
  .post(
    "/login",
    apiKeyGuard(["auth:write"]),
    validateDTO(LoginDto, "body"),
    authController.postLogin,
  )
  .post(
    "/signup",
    apiKeyGuard(["auth:write"]),
    validateDTO(RegisterDto, "body"),
    authController.postSignup,
  )
  .post(
    "/reset-password/request",
    apiKeyGuard(["auth:write"]),
    validateDTO(RecoveryPasswordRequestDto, "body"),
    authController.postResetPassRequest,
  )
  .post(
    "/verify-email",
    apiKeyGuard(["auth:write"]),
    validateDTO(ValidateEmailVerificationCodeDto, "body"),
    authController.postEmailVerificationCode,
  )
  .post(
    "/reset-password/validate",
    apiKeyGuard(["auth:write"]),
    validateDTO(ValidateResetPassCodeDto, "body"),
    authController.postResetPassCode,
  )
  .post(
    "/resend-email-code",
    apiKeyGuard(["auth:write"]),
    validateDTO(ResendEmailVerificationCodeDto, "body"),
    authController.postNewEmailVerificationCode,
  )
  .patch(
    "/reset-password/:userId",
    apiKeyGuard(["auth:write"]),
    validateDTO(ResetUserPasswordDto, "body"),
    validateDTO(UserIdParamDto, "params"),
    authController.patchUserPasswordReset,
  )
  // Endpoints Protegidos
  .patch(
    "/change-password",
    apiKeyGuard(["auth:write"]),
    validateDTO(ChangeUserPasswordDto, "body"),
    authMiddleware,
    authController.patchUserPassword,
  )
  .post(
    "/refresh",
    apiKeyGuard(["auth:write"]),
    authController.postRefreshSession,
  )
  .post(
    "/logout",
    apiKeyGuard(["auth:write"]),
    softAuthMiddleware,
    authController.postLogout,
  )
  .post(
    "/change-email/request",
    apiKeyGuard(["auth:write"]),
    validateDTO(SendEmailChangeRequestDto, "body"),
    authMiddleware,
    authController.postEmailChangeRequest,
  )
  .patch(
    "/change-email",
    apiKeyGuard(["auth:write"]),
    validateDTO(ValidateCodeAndUpdateEmailDto, "body"),
    authMiddleware,
    authController.patchUserEmail,
  );

export { router };
