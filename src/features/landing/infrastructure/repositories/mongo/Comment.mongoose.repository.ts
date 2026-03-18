import { PaginatedResponse } from "@/core/domain/types";

import { AppError } from "@/core/domain/exeptions/AppError";

import { Comment } from "@/features/landing/domain/entities";
import { CommentRespository } from "@/features/landing/domain/repositories";
import { CreateComment, Pagination } from "@/features/landing/domain/types";

import { CommentModel } from "./Comment.model";

import { ErrorMessages } from "@/shared/utils";

/**
 * Repositorio de comentarios usando Mongoose.
 *
 * Implementa la interfaz CommentRespository para realizar operaciones
 * de lectura y escritura de comentarios almacenados en MongoDB.
 * Los errores se encapsulan en AppError con código 500.
 */
export class CommentMongoRepository implements CommentRespository {
  /**
   * Lista comentarios con paginación según un filtro de consulta.
   *
   * @param {Record<string, unknown>} query - Filtros de búsqueda para los comentarios (criterios de Mongoose).
   * @param {Pagination} pagination - Parámetros de paginación (skip, pageNumber, limitNumber).
   * @returns {Promise<PaginatedResponse<Comment>>} Respuesta paginada con los comentarios mapeados a la entidad de dominio.
   * @throws {AppError} Cuando ocurre un error al consultar o contar los comentarios en la base de datos.
   */
  async findComments(
    query: Record<string, unknown>,
    pagination: Pagination,
  ): Promise<PaginatedResponse<Comment>> {
    try {
      const { skip, pageNumber, limitNumber } = pagination;

      const comments = await CommentModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec();

      const totalItems: number = await CommentModel.countDocuments(query);

      return {
        records: comments.map((c) => {
          const { _id, commentContent, userFullname, createdAt } = c.toObject();
          return new Comment(
            _id.toString(),
            userFullname,
            commentContent,
            createdAt,
          );
        }),
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalItems / limitNumber),
        totalItems,
      };
    } catch (error) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while listing all comments`,
        false,
        error,
      );
    }
  }

  /**
   * Crea un nuevo comentario en la base de datos.
   *
   * @param {CreateComment} newComment - Datos necesarios para crear el comentario.
   * @returns {Promise<void>} No retorna contenido si la operación es exitosa.
   * @throws {AppError} Cuando ocurre un error al insertar el comentario en la base de datos.
   */
  async create(newComment: CreateComment): Promise<void> {
    try {
      await CommentModel.create(newComment);
    } catch (error) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while posting the comment`,
        false,
        error,
      );
    }
  }
}
