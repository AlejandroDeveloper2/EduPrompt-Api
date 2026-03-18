import { Comment } from "../entities";

type Pagination = {
  limitNumber: number;
  pageNumber: number;
  skip: number;
};

type CreateComment = Omit<Comment, "commentId" | "createdAt">;

export { Pagination, CreateComment };
