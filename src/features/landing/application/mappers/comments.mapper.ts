import { Comment } from "../../domain/entities";

import { CommentDto, CommentOutput } from "../dto/comment.dto";

/**
 * Mapea una entidad de dominio Comment a un DTO de salida validado por el esquema CommentDto.
 *
 * @param {Comment} entity - Entidad de comentario del dominio a transformar.
 * @returns {CommentOutput} Objeto DTO de salida con las propiedades normalizadas y validadas.
 */
export const toCommentOuputDto = (entity: Comment): CommentOutput => {
  const json = {
    commentId: entity.commentId,
    userFullname: entity.userFullname,
    commentContent: entity.commentContent,
    createdAt: entity.createdAt,
  };

  return CommentDto.parse(json);
};
