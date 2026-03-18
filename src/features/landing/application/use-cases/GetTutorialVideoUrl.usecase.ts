import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { MediaAssetsRepository } from "../../domain/repositories";

/**
 * Caso de uso para obtener la URL del video tutorial de instalación.
 *
 * Utiliza el repositorio de activos multimedia para consultar la carpeta
 * destinada al video tutorial.
 */
export class GetTutorialVideoUrlUseCase {
  private readonly folder: string = "eduprompt_tutorial_video";

  /**
   * @param {MediaAssetsRepository} mediaAssetsRepository - Repositorio de acceso a activos multimedia.
   */
  constructor(private readonly mediaAssetsRepository: MediaAssetsRepository) {}

  /**
   * Ejecuta el caso de uso y retorna la URL del video tutorial.
   * Lanza un error con código 404 si no se encuentra el recurso.
   *
   * @returns {Promise<{ videoUrl: string }>} Objeto con la URL del video tutorial.
   * @throws {AppError} Si no hay un video disponible en la carpeta configurada.
   */
  async run(): Promise<{ videoUrl: string }> {
    const videoUrl = await this.mediaAssetsRepository.findVideoUrl(this.folder);

    if (!videoUrl)
      throw new AppError(
        ErrorMessages.VIDEO_NOT_AVAILABLE,
        404,
        "Installation tutorial video is not available",
        true,
      );

    return { videoUrl };
  }
}
