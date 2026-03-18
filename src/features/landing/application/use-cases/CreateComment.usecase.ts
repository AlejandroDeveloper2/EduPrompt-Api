import { CommentRespository } from "../../domain/repositories";

import { CreateCommentInput } from "../dto";

/**
 * Caso de uso para crear un nuevo comentario.
 *
 * Valida y delega la creación del comentario al repositorio correspondiente.
 */
export class CreateCommentUseCase {
  /**
   * @param {CommentRespository} commentRepository - Repositorio para operaciones de persistencia de comentarios.
   */
  constructor(private readonly commentRepository: CommentRespository) {}

  /**
   * Ejecuta la creación de un comentario a partir de los datos de entrada.
   *
   * @param {CreateCommentInput} createCommentInput - Datos necesarios para crear el comentario.
   * @returns {Promise<void>} No retorna contenido si la operación es exitosa.
   */
  async run(createCommentInput: CreateCommentInput): Promise<void> {
    await this.commentRepository.create(createCommentInput);
  }
}
