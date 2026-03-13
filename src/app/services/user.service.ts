import { inject, Injectable } from '@angular/core';
import { Api } from './api';
import { map, Observable } from 'rxjs';
import { User } from '../models/user';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class UserService
{
  private api = inject(Api);

  getAllUsers(): Observable<User[]>
  {
    return this.api.get<User[]>('/users');
  }

  getUserByID(userId: string): Observable<User>
  {
    return this.api.get<{ user:User }>(`/users/${userId}`).pipe(
      map(response => response.user)
    );
  }

  getUserProfile(userId: string, page: number = 1, limit: number = 10): Observable<{ user: User, posts: Post[], totalPages: number, postsLikes: number, commentsLikes: number }>
  {
    return this.api.get<{ user: User, posts: Post[], totalPages: number, postsLikes: number, commentsLikes: number }>(`/users/${userId}/profile?page=${page}&limit=${limit}`);
  }
}