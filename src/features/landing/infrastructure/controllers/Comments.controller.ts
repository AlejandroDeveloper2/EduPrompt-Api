import { NextFunction, Request, Response } from "express";

import { CommentsServiceContainer } from "../containers";

import { handleHttp } from "@/shared/utils";

import { CommentFiltersInput, CreateCommentInput } from "../../application/dto";
import { toCommentOuputDto } from "../../application/mappers";
import { Comment } from "../../domain/entities";

const commentsServiceContainer = new CommentsServiceContainer();

class CommentsController {
  /**
   * Maneja la obtención paginada de comentarios.
   *
   * Lee filtros y paginación del querystring, ejecuta el caso de uso y
   * responde con los comentarios mapeados a DTO.
   *
   * @param {Request} req - Objeto de solicitud de Express (usa req.query como filtros).
   * @param {Response} res - Objeto de respuesta de Express.
   * @param {NextFunction} next - Función next para el manejo de errores middleware.
   * @returns {Promise<void>} Envía respuesta HTTP 200 con la data paginada.
   */
  async getComments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const filters = req.query as CommentFiltersInput;
      const paginatedComments =
        await commentsServiceContainer.findComments.run(filters);

      handleHttp(
        res,
        {
          data: {
            ...paginatedComments,
            records: paginatedComments.records.map((r: Comment) =>
              toCommentOuputDto(r),
            ),
          },
          message: "¡Comentarios cargados con éxito!",
        },
        200,
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Maneja la creación de un nuevo comentario.
   *
   * Lee el cuerpo de la petición, ejecuta el caso de uso y responde con
   * confirmación de creación.
   *
   * @param {Request} req - Objeto de solicitud de Express (usa req.body como entrada del comentario).
   * @param {Response} res - Objeto de respuesta de Express.
   * @param {NextFunction} next - Función next para el manejo de errores middleware.
   * @returns {Promise<void>} Envía respuesta HTTP 201 si se crea correctamente.
   */
  async postComment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const comment = req.body as CreateCommentInput;
      await commentsServiceContainer.createComment.run(comment);

      handleHttp(
        res,
        {
          data: null,
          message: "¡Comentario creado  con éxito!",
        },
        201,
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const commentsController = new CommentsController();
