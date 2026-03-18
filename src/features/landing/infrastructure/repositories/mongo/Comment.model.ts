import { model, Schema } from "mongoose";

import { Comment } from "../../../domain/entities";

export interface MongoComment extends Omit<Comment, "commentId"> {
  _id: string;
  createdAt: Date;
}

/** Esquema de comments en mongo db */
const CommentSchema = new Schema<MongoComment>(
  {
    userFullname: {
      type: String,
      required: true,
    },
    commentContent: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export const CommentModel = model("comments", CommentSchema);
