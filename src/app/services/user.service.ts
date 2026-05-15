import { inject, Injectable } from '@angular/core';
import { Api } from './api';
import { map, Observable } from 'rxjs';
import { User } from '../models/user';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = inject(Api);

  getAllUsers(): Observable<User[]> {
    return this.api.get<User[]>('/users');
  }

  getUserByID(userId: string): Observable<User> {
    return this.api.get<{ user: User }>(`/users/${userId}`).pipe(
      map(response => response.user)
    );
  }

  getUserProfile(userId: string, page: number = 1, limit: number = 10): Observable<{
    user: User;
    posts: Post[];
    totalPages: number;
    postsLikes: number;
    commentsLikes: number;
  }> {
    return this.api.get(`/users/${userId}/profile?page=${page}&limit=${limit}`);
  }

  updateProfile(fields: { name?: string; isEmailPublic?: boolean }): Observable<{ message: string; user: User }> {
    return this.api.put<{ message: string; user: User }>('/users/profile', fields);
  }

  changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Observable<{ message: string }> {
    return this.api.put<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
  }

  toggleAdmin(userId: string): Observable<{ message: string; user: User }> {
    return this.api.put<{ message: string; user: User }>(`/users/${userId}/toggle-admin`, {});
  }

  adminUpdateUser(userId: string, fields: { name?: string; email?: string; password?: string }): Observable<{ message: string; user: User }> {
    return this.api.put<{ message: string; user: User }>(`/users/${userId}`, fields);
  }

  deleteUser(userId: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/users/${userId}`);
  }
}
