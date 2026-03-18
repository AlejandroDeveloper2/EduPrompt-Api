import { Notification } from "../entities";

type NotificationLink = {
  label: LangTemplate;
  href: string;
};
type Order = "asc" | "desc";

type CreateNotification = Omit<
  Notification,
  "notificationId" | "creationDate" | "read"
>;
type UpdateNotification = CreateNotification;

export type { NotificationLink, Order, CreateNotification, UpdateNotification };
