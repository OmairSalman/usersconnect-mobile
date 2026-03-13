import { MinimalUser } from "./user";

export interface Comment {
  _id: string;
  content: string;
  author: MinimalUser;
  likes: MinimalUser[];
  dislikes: MinimalUser[];
  createdAt: Date;
  updatedAt: Date;
}