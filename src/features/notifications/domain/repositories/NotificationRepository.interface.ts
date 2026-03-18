import { Notification } from "../entities";
import { CreateNotification, Order, UpdateNotification } from "../types";

export interface NotificationRepositoryType {
  findAll: (order: Order) => Promise<Notification[]>;
  create: (newNotification: CreateNotification) => Promise<void>;
  findById: (notificationId: string) => Promise<Notification | null>;
  update: (
    notificationId: string,
    updatedNotification: UpdateNotification,
  ) => Promise<{ matchedCount: number }>;
  deleteMany: (notificationIds: string[]) => Promise<number>;
  markAsRead: (notificationIds: string[]) => Promise<{ matchedCount: number }>;
}
