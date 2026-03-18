import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { PromptRespositoryType } from "../../domain/repositories/PromptRepository.interface";

import { DeletePromptsByIdInput } from "../dto";

export class DeleteManyPromptsUseCase {
  constructor(private readonly promptsRepository: PromptRespositoryType) {}
  /**
   * Elimina múltiples prompts de un usuario.
   *
   * @param userId - ID del usuario dueño de los prompts.
   * @param deletePromptsByIdInput - Objeto con el array de IDs de prompts a eliminar.
   * @throws {AppError} Si alguno de los prompts no existe.
   */
  async run(
    userId: string,
    deletePromptsByIdInput: DeletePromptsByIdInput,
  ): Promise<void> {
    const { promptIds } = deletePromptsByIdInput;

    const deletedCount = await this.promptsRepository.deleteMany(
      userId,
      promptIds,
    );

    if (deletedCount < promptIds.length)
      throw new AppError(
        ErrorMessages.SOME_PROMPT_NOT_FOUND,
        404,
        "Some prompt does not exists in the database.",
        true,
      );
  }
}
