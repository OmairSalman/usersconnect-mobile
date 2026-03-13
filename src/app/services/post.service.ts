import { Injectable, inject } from '@angular/core';
import { Api } from './api';
import { Post } from '../models/post';
import { Observable } from 'rxjs';
import { MinimalUser } from '../models/user';

// Response type interfaces
interface PostCreateResponse {
  message: string;
  post: Post;
}

interface PostUpdateResponse {
  message: string;
  post: Post;
}

interface PostDeleteResponse {
  message: string;
  post: Post;
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

interface FeedResponse {
  posts: Post[];
  totalPages: number;
  limit: number;  // ✅ Backend also returns this
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private api = inject(Api);

  // GET /posts - with pagination
  getPosts(page: number = 1, limit: number = 10): Observable<Post[]> {
    return this.api.get<Post[]>(`/posts?page=${page}&limit=${limit}`);
  }

  // GET /posts/feed
  getFeed(page: number = 1, limit: number = 10): Observable<FeedResponse> {
    return this.api.get<FeedResponse>(`/posts/feed?page=${page}&limit=${limit}`);
  }

  // GET /posts/:postId
  getPost(id: string): Observable<Post> {
    return this.api.get<Post>(`/posts/${id}`);
  }

  // GET /posts/user/:userId
  getPostsByUser(userId: string, page: number = 1, limit: number = 10): Observable<Post[]> {
    return this.api.get<Post[]>(`/posts/user/${userId}?page=${page}&limit=${limit}`);
  }

  // POST /posts
  createPost(title: string, content: string, imageURL?: string): Observable<PostCreateResponse> {
    return this.api.post<PostCreateResponse>('/posts', { 
      title, 
      content, 
      imageURL 
    });
  }

  // PUT /posts/:postId
  updatePost(id: string, title: string, content: string, imageURL?: string | null): Observable<PostUpdateResponse> {
    return this.api.put<PostUpdateResponse>(`/posts/${id}`, { 
      title, 
      content, 
      imageURL 
    });
  }

  // DELETE /posts/:postId
  deletePost(id: string): Observable<PostDeleteResponse> {
    return this.api.delete<PostDeleteResponse>(`/posts/${id}`);
  }

  // POST /posts/:postId/like
  like(postId: string): Observable<LikeResponse> {
    return this.api.post<LikeResponse>(`/posts/${postId}/like`, {});
  }

  // DELETE /posts/:postId/like
  unlike(postId: string): Observable<LikeResponse> {
    return this.api.delete<LikeResponse>(`/posts/${postId}/like`);
  }

  // POST /posts/:postId/dislike
  dislike(postId: string): Observable<DislikeResponse> {
    return this.api.post<DislikeResponse>(`/posts/${postId}/dislike`, {});
  }

  // DELETE /posts/:postId/dislike
  undislike(postId: string): Observable<DislikeResponse> {
    return this.api.delete<DislikeResponse>(`/posts/${postId}/dislike`);
  }
}