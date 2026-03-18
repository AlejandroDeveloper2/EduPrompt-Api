import { MediaAssetsRepository } from "../../domain/repositories";

/**
 * Caso de uso para obtener las URLs de capturas de pantalla de la aplicación.
 *
 * Utiliza el repositorio de activos multimedia para consultar Cloudinary
 * en la carpeta predeterminada de screenshots.
 */
export class GetScreenshotsUseCase {
  private readonly folder: string = "eduprompt_screenshots";

  /**
   * @param {MediaAssetsRepository} mediaAssetsRepository - Repositorio de acceso a activos multimedia.
   */
  constructor(private readonly mediaAssetsRepository: MediaAssetsRepository) {}

  /**
   * Ejecuta el caso de uso y retorna las URLs de las capturas de pantalla.
   *
   * @returns {Promise<{ screenshotsUrls: string[] }>} Objeto con el arreglo de URLs de screenshots.
   */
  async run(): Promise<{ screenshotsUrls: string[] }> {
    const screenshotsUrls: string[] =
      await this.mediaAssetsRepository.findAppScreenshots(this.folder);

    return { screenshotsUrls };
  }
}
