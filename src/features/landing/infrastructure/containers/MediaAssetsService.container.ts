import {
  GetDemoVideoUrlUseCase,
  GetScreenshotsUseCase,
  GetTutorialVideoUrlUseCase,
} from "../../application/use-cases";

import { MediaAssetsCloudinaryRepository } from "../repositories";

const mediaAssetsRepository = new MediaAssetsCloudinaryRepository();

/**
 * Contenedor de servicios para casos de uso relacionados con activos multimedia.
 *
 * Provee instancias de casos de uso configuradas con el repositorio
 * de Cloudinary para recuperar imágenes y videos.
 */
export class MediaAssetsServiceContainer {
  /**
   * Caso de uso para obtener URLs de capturas de pantalla.
   * @type {GetScreenshotsUseCase}
   */
  getScreenshots: GetScreenshotsUseCase = new GetScreenshotsUseCase(
    mediaAssetsRepository,
  );

  /**
   * Caso de uso para obtener la URL del video de demostración.
   * @type {GetDemoVideoUrlUseCase}
   */
  getDemoVideoUrl: GetDemoVideoUrlUseCase = new GetDemoVideoUrlUseCase(
    mediaAssetsRepository,
  );

  /**
   * Caso de uso para obtener la URL del video tutorial.
   * @type {GetTutorialVideoUrlUseCase}
   */
  getTutorialVideoUrl: GetTutorialVideoUrlUseCase =
    new GetTutorialVideoUrlUseCase(mediaAssetsRepository);
}
