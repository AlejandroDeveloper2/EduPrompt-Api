import { render } from "@react-email/render";

import { EmailTemplate } from "@/core/domain/ports/IEmailSender.interface";

import {
  ResetPasswordEmail,
  AccountActivationEmail,
  EmailChangeEmail,
  PaymentErrorEmail,
} from "./emails";

/**
 * Servicio para renderizar plantillas de correo electrónico.
 * Convierte componentes React a HTML según el tipo de plantilla especificado.
 */
export class TemplateService {
  /**
   * Renderiza una plantilla de correo a HTML.
   * @param templateName - Tipo de plantilla a renderizar (recuperación de contraseña, activación de cuenta, etc.)
   * @param variables - Variables para inyectar en la plantilla (userName, verificationCode, etc.)
   * @returns Promise que resuelve con el HTML renderizado de la plantilla
   */
  static async render(
    templateName: EmailTemplate,
    variables: Record<string, string>,
  ): Promise<string> {
    const userName = variables["userName"] ?? "...";
    const verificationCode = variables["verificationCode"] ?? "...";

    if (templateName === "password-reset")
      return await render(
        <ResetPasswordEmail
          userName={userName}
          verificationCode={verificationCode}
        />,
      );
    if (templateName === "account-activation")
      return await render(
        <AccountActivationEmail
          userName={userName}
          verificationCode={verificationCode}
        />,
      );
    if (templateName === "email-change")
      return await render(
        <EmailChangeEmail
          userName={userName}
          verificationCode={verificationCode}
        />,
      );

    return render(<PaymentErrorEmail userName={userName} />);
  }
}
