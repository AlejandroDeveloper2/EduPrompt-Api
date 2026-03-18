export interface MediaAssetsRepository {
  findAppScreenshots: (folderName: string) => Promise<string[]>;
  findVideoUrl: (folderName: string) => Promise<string | null>;
}
