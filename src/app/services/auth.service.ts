import { Injectable, inject, signal } from '@angular/core';
import { Api } from './api';
import { User } from '../models/user';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService
{
  private api = inject(Api);

  currentUser = signal<User | null>(null);
  authError = signal<string>('');
  authChecked = signal<boolean>(false);

  checkAuth(): Observable<User | null>
  {
    return this.api.get<{ user: User }>('/auth/me').pipe(
      tap((response) =>
      {
        this.currentUser.set(response.user);
        this.authChecked.set(true);
      }),
      map((response) => response.user),
      catchError(() =>
        {
          this.currentUser.set(null);
          this.authChecked.set(true);
          return of(null);
        })
    );
  }

  isAuthReady = (): boolean => {return this.authChecked()};

  login(email: string, password: string): Observable<{ user: User }>
  {
    this.authError.set('');
    return this.api.post<{ user: User }>('/auth/login', { email, password });
  }

  logout(): Observable<{ message: string }>
  {
    return this.api.get<{ message: string }>('/auth/logout').pipe(
      tap(() =>
      {
        this.currentUser.set(null);
      })
    );
  }

  register(name: string, email: string, password: string, confirmPassword: string): Observable<{ user: User }>
  {
    this.authError.set('');
    return this.api.post<{ user: User }>('/auth/register', { name, email, password, confirmPassword });
  }

  forgotPassword(email: string): Observable<{ success: boolean, message: string }>
  {
    this.authError.set('');
    return this.api.post<{ success: boolean, message: string }>('/auth/forgot-password', { email });
  }

  submitResetPasswordCode(code: string): Observable<{ success: boolean, message: string }>
  {
    this.authError.set('');
    return this.api.post<{ success: boolean, message: string }>('/auth/verify-reset-code', { code });
  }

  resendPasswordResetCode(): Observable<{ success: boolean, message: string }>
  {
    return this.api.post<{ success: boolean, message: string }>('/auth/resend-reset-code', {});
  }

  resetPassword(newPassword: string, confirmPassword: string): Observable<{ success: boolean, message: string }>
  {
    this.authError.set('');
    return this.api.post<{ success: boolean, message: string }>('/auth/reset-password', { newPassword, confirmPassword });
  }

  checkResetSession(): Observable<{ hasSession: boolean }>
  {
    return this.api.get<{ hasSession: boolean }>('/auth/check-reset-session');
  }

  requestEmailVerification(): Observable<{ success: boolean; message: string }>
  {
    return this.api.post<{ success: boolean; message: string }>('/auth/email-verification/request', {});
  }

  verifyEmailCode(code: string): Observable<{ success: boolean; message: string }>
  {
    return this.api.post<{ success: boolean; message: string }>('/auth/email-verification/verify', { code });
  }
}