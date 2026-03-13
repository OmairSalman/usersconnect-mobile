import { Injectable, inject, signal } from '@angular/core';
import { Api } from './api';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService
{
  private api = inject(Api);
  private configChecked = signal(false);

  isS3Enabled = signal(false);
  isSMTPEnabled = signal(false);

  isConfigReady = (): boolean => {return this.configChecked()};

  checkConfig(): Observable<boolean | null>
  {
    this.checkS3Config().subscribe();
    this.checkSMTPConfig().subscribe();

    return of(true).pipe(
      tap(() => this.configChecked.set(true)),
      catchError(() =>
        {
          this.configChecked.set(true);
          return of(null);
        })
    );
  }

  checkS3Config(): Observable<boolean | null>
  {
    return this.api.get<{ s3Enabled:boolean }>('/config/s3').pipe(
      tap((response) =>
        {
          this.isS3Enabled.set(response.s3Enabled);
        }),
      map((response) => response.s3Enabled),
      catchError(() =>
        {
          this.isS3Enabled.set(false);
          return of(null);
        })
    );
  }

  checkSMTPConfig(): Observable<boolean | null>
  {
    return this.api.get<{ smtpEnabled:boolean }>('/config/smtp').pipe(
      tap((response) =>
        {
          this.isSMTPEnabled.set(response.smtpEnabled);
        }),
      map((response) => response.smtpEnabled),
      catchError(() =>
        {
          this.isSMTPEnabled.set(false);
          return of(null);
        })
    );
  }
}