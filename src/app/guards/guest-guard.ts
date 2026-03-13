import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) =>
{
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthReady())
  {
    if(authService.currentUser())
    {
      router.navigate(['/feed']);
      return false;
    }
    else
    {
      return true;
    }
  }

  return authService.checkAuth().pipe(
    map((user) =>
    {
      if(user)
      {
        router.navigate(['/feed']);
        return false;
      }
      else
      {
        return true;
      }
    })
  );
};