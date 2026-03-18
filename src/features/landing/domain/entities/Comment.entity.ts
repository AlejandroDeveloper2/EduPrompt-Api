/**
 * Entidad de dominio que representa un comentario.
 * Modela los datos principales asociados a un comentario creado por un usuario.
 */
export class Comment {
  /**
   * Crea una instancia de comentario.
   * @param commentId Identificador único del comentario.
   * @param userFullname Nombre completo del usuario.
   * @param commentContent Contenido del comentario.
   * @param createdAt Fecha de creación del comentario.
   */
  constructor(
    public readonly commentId: string,
    public userFullname: string,
    public commentContent: string,
    public createdAt: Date,
  ) {}
}
