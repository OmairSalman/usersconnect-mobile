import { Injectable, inject } from '@angular/core';
import { Api } from './api';
import { Comment } from '../models/comment';
import { Observable } from 'rxjs';
import { MinimalUser } from '../models/user';

interface CommentResponse
{
  message: string;
  comment: Comment;
}

interface LikeResponse {
  message: string;
  liked: boolean;
  likeCount: number;
  likes: MinimalUser[];
  dislikeCount: number;
  dislikes: MinimalUser[];
}

interface DislikeResponse {
  message: string;
  disliked: boolean;
  dislikeCount: number;
  dislikes: MinimalUser[];
  likeCount: number;
  likes: MinimalUser[];
}

@Injectable({
  providedIn: 'root',
})
export class CommentService
{
  private api = inject(Api);

  // POST /comments/:postId
  saveComment(postId: string, content: string): Observable<CommentResponse>
  {
    return this.api.post<CommentResponse>(`/comments/${postId}`, {content});
  }

  // PUT /comments/:commentId
  updateComment(commentId: string, content: string): Observable<CommentResponse>
  {
    return this.api.put<CommentResponse>(`/comments/${commentId}`, {content});
  }

  // DELETE /comments/:commentId
  deleteComment(commentId: string): Observable<CommentResponse>
  {
    return this.api.delete<CommentResponse>(`/comments/${commentId}`)
  }

  // POST /comments/:commentId/like
  like(commentId: string): Observable<LikeResponse> {
    return this.api.post<LikeResponse>(`/comments/${commentId}/like`, {});
  }

  // DELETE /comments/:commentId/like
  unlike(commentId: string): Observable<LikeResponse> {
    return this.api.delete<LikeResponse>(`/comments/${commentId}/like`);
  }

  // POST /comments/:commentId/dislike
  dislike(commentId: string): Observable<DislikeResponse> {
    return this.api.post<DislikeResponse>(`/comments/${commentId}/dislike`, {});
  }

  // DELETE /comments/:commentId/dislike
  undislike(commentId: string): Observable<DislikeResponse> {
    return this.api.delete<DislikeResponse>(`/comments/${commentId}/dislike`);
  }
}