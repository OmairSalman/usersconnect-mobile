import { MinimalUser } from "./user";
import { Comment } from "./comment";

export interface Post {
  _id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: MinimalUser;
  likes: MinimalUser[];
  dislikes: MinimalUser[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}