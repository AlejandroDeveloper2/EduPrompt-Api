export type EmailTemplate =
  | "account-activation"
  | "password-reset"
  | "email-change"
  | "payment-error";

export interface IEmailSender {
  sendEmail: <T>(
    subject: string,
    receivers: string[],
    template: EmailTemplate,
    data: T,
  ) => Promise<void>;
}
