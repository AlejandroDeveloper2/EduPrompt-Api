import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { NotificationRepositoryType } from "../../domain/repositories/NotificationRepository.interface";

import { DeleteNotificationsByIdInput } from "../dto";

export class DeleteManyNotificationsUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepositoryType,
  ) {}
  /**
   * Elimina múltiples notificaciones.
   *
   * @param deleteNotificationsByIdInput - Objeto con el array de IDs de notificaciones a eliminar.
   * @throws {AppError} Si alguno de las notificaciones no existe.
   */
  async run(
    deleteNotificationsByIdInput: DeleteNotificationsByIdInput,
  ): Promise<void> {
    const { notificationIds } = deleteNotificationsByIdInput;

    const deletedCount =
      await this.notificationRepository.deleteMany(notificationIds);

    if (deletedCount < notificationIds.length)
      throw new AppError(
        ErrorMessages.SOME_NOTIFICATION_NOT_FOUND,
        404,
        "Some notification does not exist in the database",
        true,
      );
  }
}
