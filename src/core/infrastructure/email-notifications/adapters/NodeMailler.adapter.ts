import { transporter } from "@/config/emailConfig";

import {
  EmailTemplate,
  IEmailSender,
} from "@/core/domain/ports/IEmailSender.interface";
import { AppError } from "@/core/domain/exeptions/AppError";

import { ErrorMessages } from "@/shared/utils";
import { TemplateService } from "../templates/template.service";

/**
 * Adaptador que implementa el envío de correos usando NodeMailer.
 * Proporciona la funcionalidad de enviar correos con plantillas renderizadas.
 */
export class NodeMailerAdapter implements IEmailSender {
  /**
   * Envía un correo electrónico con una plantilla específica.
   * @template T - Tipo de datos a pasar a la plantilla
   * @param subject - Asunto del correo
   * @param receivers - Array de direcciones de correo destinatarios
   * @param template - Nombre de la plantilla a usar
   * @param data - Datos variables para renderizar en la plantilla
   * @throws {AppError} Si ocurre un error durante el envío del correo
   * @returns Promise que se resuelve cuando el correo se envía exitosamente
   */
  async sendEmail<T>(
    subject: string,
    receivers: string[],
    template: EmailTemplate,
    data: T,
  ): Promise<void> {
    try {
      const receiverEmails: string = receivers.join(", ");

      const html = await TemplateService.render(
        template,
        data as Record<string, string>,
      );

      await transporter.sendMail({
        from: '"EduPrompt App" <support@eduuprompt.com>',
        to: receiverEmails,
        subject,
        html,
      });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.EMAIL_SENDING_ERROR,
        500,
        "An error ocurred while sending the email",
        false,
        error,
      );
    }
  }
}
