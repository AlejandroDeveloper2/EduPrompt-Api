import {
  CreateCommentUseCase,
  FindCommentsUseCase,
} from "../../application/use-cases";

import { CommentMongoRepository } from "../repositories";

const commentRepository = new CommentMongoRepository();

/**
 * Contenedor de servicios para casos de uso relacionados con comentarios.
 *
 * Expone instancias de casos de uso preparadas con el repositorio
 * de comentarios basado en Mongoose.
 */
export class CommentsServiceContainer {
  /**
   * Caso de uso para listar comentarios con paginación.
   * @type {FindCommentsUseCase}
   */
  findComments: FindCommentsUseCase = new FindCommentsUseCase(
    commentRepository,
  );

  /**
   * Caso de uso para crear un nuevo comentario.
   * @type {CreateCommentUseCase}
   */
  createComment: CreateCommentUseCase = new CreateCommentUseCase(
    commentRepository,
  );
}
