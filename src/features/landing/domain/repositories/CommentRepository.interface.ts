import { PaginatedResponse } from "@/core/domain/types";
import { CreateComment, Pagination } from "../types";

import { Comment } from "../entities";

export interface CommentRespository {
  findComments: (
    query: Record<string, unknown>,
    pagination: Pagination,
  ) => Promise<PaginatedResponse<Comment>>;
  create: (newComment: CreateComment) => Promise<void>;
}
