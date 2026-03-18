import { PaginatedResponse } from "@/core/domain/types";

import { Comment } from "../../domain/entities";
import { CommentRespository } from "../../domain/repositories";

import { CommentFiltersInput } from "../dto";

/**
 * Caso de uso para listar comentarios con paginación.
 *
 * Normaliza los parámetros de paginación de entrada y delega la consulta
 * al repositorio de comentarios.
 */
export class FindCommentsUseCase {
  /**
   * @param {CommentRespository} commentRepository - Repositorio para operaciones de persistencia de comentarios.
   */
  constructor(private readonly commentRepository: CommentRespository) {}

  /**
   * Ejecuta la búsqueda paginada de comentarios según los filtros recibidos.
   *
   * @param {CommentFiltersInput} commentFiltersInput - Filtros y parámetros de paginación (page, limit).
   * @returns {Promise<PaginatedResponse<Comment>>} Respuesta paginada con los comentarios.
   */
  async run(
    commentFiltersInput: CommentFiltersInput,
  ): Promise<PaginatedResponse<Comment>> {
    const { page, limit } = commentFiltersInput;

    const pageNumber = parseInt(page ?? "1", 10) || 1;
    const limitNumber = parseInt(limit ?? "10", 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const baseQuery: Record<string, unknown> = {};

    return await this.commentRepository.findComments(baseQuery, {
      limitNumber,
      pageNumber,
      skip,
    });
  }
}
