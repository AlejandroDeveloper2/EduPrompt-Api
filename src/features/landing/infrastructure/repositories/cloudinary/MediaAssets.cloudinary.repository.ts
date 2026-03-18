import { v2 as cloudinary } from "cloudinary";

import { AppError } from "@/core/domain/exeptions/AppError";
import { ErrorMessages } from "@/shared/utils";

import { MediaAssetsRepository } from "@/features/landing/domain/repositories";

/**
 * Repositorio de activos multimedia en Cloudinary para la capa de Landing.
 *
 * Provee métodos para recuperar capturas de pantalla (imágenes) y videos
 * desde una carpeta de activos en Cloudinary utilizando su API.
 *
 * Errores operativos se encapsulan en AppError con el código 500 y un mensaje
 * estándar de ErrorMessages.CONTENT_LOAD_ERROR.
 */
export class MediaAssetsCloudinaryRepository implements MediaAssetsRepository {
  /**
   * Obtiene las URLs seguras (HTTPS) de las imágenes almacenadas en una carpeta de activos de Cloudinary.
   *
   * @param {string} folderName - Nombre de la carpeta de activos en Cloudinary.
   * @returns {Promise<string[]>} Lista de URLs de las imágenes encontradas. Puede ser un arreglo vacío si no hay recursos.
   * @throws {AppError} Cuando ocurre un error al cargar los recursos desde Cloudinary.
   */
  async findAppScreenshots(folderName: string): Promise<string[]> {
    try {
      const result = await cloudinary.api.resources_by_asset_folder(
        folderName,
        {
          media_metadata: true,
          resource_type: "image",
        },
      );
      const screenshots = result.resources.map((r) => r.secure_url);
      return screenshots;
    } catch (error) {
      throw new AppError(
        ErrorMessages.CONTENT_LOAD_ERROR,
        500,
        "An error ocurred while load the assets",
        false,
        error,
      );
    }
  }

  /**
   * Obtiene la URL segura (HTTPS) del último video disponible en una carpeta de activos de Cloudinary.
   *
   * Si no existe ningún video en la carpeta indicada, devuelve null.
   *
   * @param {string} folderName - Nombre de la carpeta de activos en Cloudinary.
   * @returns {Promise<string | null>} URL del video encontrado o null si no hay videos.
   * @throws {AppError} Cuando ocurre un error al cargar el recurso de video desde Cloudinary.
   */
  async findVideoUrl(folderName: string): Promise<string | null> {
    try {
      const result = await cloudinary.api.resources_by_asset_folder(
        folderName,
        {
          media_metadata: true,
          resource_type: "video",
        },
      );

      const videoUrl = result.resources.map((r) => r.secure_url).pop();
      if (!videoUrl) return null;

      return videoUrl;
    } catch (error) {
      throw new AppError(
        ErrorMessages.CONTENT_LOAD_ERROR,
        500,
        "An error ocurred while load video asset: ${JSON.stringify(error)}",
        false,
        error,
      );
    }
  }
}
