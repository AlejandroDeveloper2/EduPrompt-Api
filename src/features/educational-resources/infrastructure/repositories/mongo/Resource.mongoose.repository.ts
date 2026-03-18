import { PaginatedResponse } from "@/core/domain/types";

import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { EducationalResourceRepositoryType } from "../../../domain/repositories/EducationalResourceRepository.interface";
import { EducationalResource } from "../../../domain/entities";
import { CreateResource, UpdateResource } from "../../../domain/types";

import { EducationalResourceModel } from "./EducationalResource.model";

/**
 * Repositorio para gestionar recursos educativos usando MongoDB.
 * Implementa el contrato definido en `EducationalResourceRepositoryType`.
 */
export class EducationalResourceMongoRepository implements EducationalResourceRepositoryType {
  /**
   * Crea un nuevo recurso educativo en la base de datos.
   *
   * @param userId - ID del usuario propietario del recurso
   * @param newResource - Objeto con los datos del recurso a crear.
   * @throws {AppError} Si ocurre un error durante la creación.
   */
  async create(userId: string, newResource: CreateResource): Promise<void> {
    try {
      await EducationalResourceModel.create({ ...newResource, userId });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error ocurred while creating resource",
        false,
        error,
      );
    }
  }

  /**
   * Obtiene todos los recursos educativos de un usuario con filtros y paginación.
   *
   * @param query - Objeto con los diferentes filtros opcionales (título, formato, etiqueta).
   * @param pagination - Objeto con las variables parseadas de paginación (página, límite, skip).
   * @returns Respuesta paginada con los recursos educativos.
   * @throws {AppError} Si ocurre un error durante la consulta.
   */
  async findAllByUser(
    query: Record<string, unknown>,
    pagination: {
      limitNumber: number;
      pageNumber: number;
      skip: number;
    },
  ): Promise<PaginatedResponse<EducationalResource>> {
    try {
      const { skip, pageNumber, limitNumber } = pagination;

      const resources = await EducationalResourceModel.find(query)
        .skip(skip)
        .limit(limitNumber)
        .exec();

      const totalItems: number =
        await EducationalResourceModel.countDocuments(query);

      return {
        records: resources.map((r) => {
          const {
            resourceId,
            title,
            content,
            format,
            formatKey,
            groupTag,
            creationDate,
            userId,
          } = r.toObject();
          return new EducationalResource(
            resourceId,
            title,
            content,
            format,
            formatKey,
            groupTag,
            creationDate,
            userId,
          );
        }),
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalItems / limitNumber),
        totalItems,
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error ocurred while finding resources",
        false,
        error,
      );
    }
  }

  /**
   * Busca un recurso educativo por su ID.
   *
   * @param resourceId - ID del recurso a buscar.
   * @returns El recurso educativo o `null` si no existe.
   * @throws {AppError} Si ocurre un error durante la búsqueda.
   */
  async findById(resourceId: string): Promise<EducationalResource | null> {
    try {
      const educationalResource = await EducationalResourceModel.findOne({
        resourceId,
      });

      if (!educationalResource) return null;

      const {
        resourceId: id,
        title,
        content,
        format,
        formatKey,
        groupTag,
        creationDate,
        userId,
      } = educationalResource.toObject();
      return new EducationalResource(
        id,
        title,
        content,
        format,
        formatKey,
        groupTag,
        creationDate,
        userId,
      );
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error ocurred while finding resource by id",
        false,
        error,
      );
    }
  }
  /**
   * Actualiza un recurso educativo de un usuario.
   *
   * @param userId - ID del usuario dueño de los recursos.
   * @param resourceId - ID del recurso a actualizar.
   * @param updatedResource - Objeto con los datos del recurso a actualizar
   * @returns El resultado de la actualización.
   * @throws {AppError} Si ocurre un error durante la actualización.
   */
  async update(
    userId: string,
    resourceId: string,
    updatedResource: UpdateResource,
  ): Promise<{ matchedCount: number }> {
    try {
      const result = await EducationalResourceModel.updateOne(
        { userId, resourceId },
        { ...updatedResource },
      );

      return {
        matchedCount: result.matchedCount,
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error ocurred while updating resource",
        false,
        error,
      );
    }
  }
  /**
   * Elimina múltiples recursos educativos de un usuario.
   *
   * @param userId - ID del usuario dueño de los recursos.
   * @param resourceIds - Array de IDs de los recursos a eliminar.
   * @returns El resultado de la eliminación.
   * @throws {AppError} Si ocurre un error durante la eliminación.
   */
  async deleteMany(userId: string, resourceIds: string[]): Promise<number> {
    try {
      const { deletedCount } = await EducationalResourceModel.deleteMany({
        userId,
        resourceId: { $in: resourceIds },
      });
      return deletedCount;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error ocurred while deleting selected resources",
        false,
        error,
      );
    }
  }
}
