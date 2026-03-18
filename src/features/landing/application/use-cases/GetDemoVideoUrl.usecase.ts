import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { MediaAssetsRepository } from "../../domain/repositories";

/**
 * Caso de uso para obtener la URL del video de demostración de la aplicación.
 *
 * Consulta el repositorio de activos multimedia en la carpeta por defecto
 * destinada al video de demo.
 */
export class GetDemoVideoUrlUseCase {
  private readonly folder: string = "eduprompt_demo_video";

  /**
   * @param {MediaAssetsRepository} mediaAssetsRepository - Repositorio de acceso a activos multimedia.
   */
  constructor(private readonly mediaAssetsRepository: MediaAssetsRepository) {}

  /**
   * Ejecuta el caso de uso y retorna la URL del video de demostración.
   * Lanza un error con código 404 si el video no está disponible.
   *
   * @returns {Promise<{ videoUrl: string }>} Objeto con la URL del video de demo.
   * @throws {AppError} Si no se encuentra un video disponible en la carpeta configurada.
   */
  async run(): Promise<{ videoUrl: string }> {
    const videoUrl = await this.mediaAssetsRepository.findVideoUrl(this.folder);

    if (!videoUrl)
      throw new AppError(
        ErrorMessages.VIDEO_NOT_AVAILABLE,
        404,
        "App Demo video is not available",
        true,
      );

    return { videoUrl };
  }
}
