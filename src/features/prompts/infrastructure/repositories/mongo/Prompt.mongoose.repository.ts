import { PaginatedResponse } from "@/core/domain/types";

import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { Prompt } from "../../../domain/entities";
import { PromptRespositoryType } from "../../../domain/repositories/PromptRepository.interface";
import { CreatePrompt, Pagination, UpdatePrompt } from "../../../domain/types";

import { PromptModel } from "./Prompt.model";

/**
 * Repositorio para gestionar prompts usando MongoDB.
 * Implementa el contrato definido en `PromptRespositoryType`.
 */
export class PromptMongoRepository implements PromptRespositoryType {
  /**
   * Crea un nuevo prompt en la base de datos.
   *
   * @param userId - Id del usuario propietario del prompt.
   * @param newPrompt - Objeto con los datos del prompt a crear.
   * @throws {AppError} Si ocurre un error durante la creación.
   */
  async create(userId: string, newPrompt: CreatePrompt): Promise<void> {
    try {
      await PromptModel.create({ ...newPrompt, userId });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error ocurred while creating a prompt",
        false,
        error,
      );
    }
  }

  /**
   * Obtiene todos los prompts de un usuario con filtros y paginación.
   *
   * @param query - Objeto con los diferentes filtros opcionales (título, etiqueta).
   * @param pagination - Objeto con las variables parseadas de paginación (página, límite, skip).
   * @returns Respuesta paginada con los prompts.
   * @throws {AppError} Si ocurre un error durante la consulta.
   */
  async findAllByUser(
    query: Record<string, unknown>,
    pagination: Pagination,
  ): Promise<PaginatedResponse<Prompt>> {
    try {
      const { skip, pageNumber, limitNumber } = pagination;

      const prompts = await PromptModel.find(query)
        .skip(skip)
        .limit(limitNumber)
        .exec();

      const totalItems: number = await PromptModel.countDocuments(query);

      return {
        records: prompts.map((p) => {
          const { promptId, promptText, promptTitle, tag, userId } =
            p.toObject();
          return new Prompt(promptId, promptTitle, promptText, tag, userId);
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
        "An error ocurred while listing all prompts",
        false,
        error,
      );
    }
  }

  /**
   * Busca un prompt por su ID.
   *
   * @param promptId - ID del prompt a buscar.
   * @returns El prompt o `null` si no existe.
   * @throws {AppError} Si ocurre un error durante la búsqueda.
   */
  async findById(promptId: string): Promise<Prompt | null> {
    try {
      const prompt = await PromptModel.findOne({ promptId });
      if (!prompt) return null;

      const {
        promptId: id,
        promptText,
        promptTitle,
        tag,
        userId,
      } = prompt.toObject();

      return new Prompt(id, promptTitle, promptText, tag, userId);
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error ocurred while finding a prompt",
        false,
        error,
      );
    }
  }
  /**
   * Actualiza un prompt.
   *
   * @param userId - ID del usuario dueño del prompt.
   * @param promptId - ID del prompt a actualizar.
   * @param updatedPrompt - Objeto con la información del prompt actualizada `promptTitle`, `promptTitle`, `tag`.
   * @returns Un objeto con el resultado de actualización
   * @throws {AppError} Si ocurre un error durante la actualización.
   */
  async update(
    userId: string,
    promptId: string,
    updatedPrompt: UpdatePrompt,
  ): Promise<{ matchedCount: number }> {
    try {
      const result = await PromptModel.updateOne(
        { userId, promptId },
        updatedPrompt,
      );
      return {
        matchedCount: result.matchedCount,
      };
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error ocurred while updating a prompt",
        false,
        error,
      );
    }
  }

  /**
   * Elimina múltiples prompts de un usuario.
   *
   * @param userId - ID del usuario dueño de los prompts.
   * @param promptIds - Array de IDs de los prompts a eliminar.
   * @returns El número de elementos eliminados
   * @throws {AppError} Si ocurre un error durante la eliminación.
   */
  async deleteMany(userId: string, promptIds: string[]): Promise<number> {
    try {
      const { deletedCount } = await PromptModel.deleteMany({
        userId,
        promptId: { $in: promptIds },
      });
      return deletedCount;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        "An error ocurred while deleting prompts",
        false,
        error,
      );
    }
  }
}
