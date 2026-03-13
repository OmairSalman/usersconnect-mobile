import { HttpInterceptorFn } from '@angular/common/http';
import { ModalService } from '../services/modal.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const emailVerificationInterceptor: HttpInterceptorFn = (req, next) =>
{
  const modalService = inject(ModalService);
  return next(req).pipe(
    catchError((error) =>
    {
      if (error.status === 403 && error.error?.requiresVerification) {
        modalService.showPleaseVerifyModal();
      }
      return throwError(() => error);
    })
  );
};