import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) =>
{
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthReady())
  {
    if(authService.currentUser())
    {
      return true;
    }
    else
    {
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
  }

  return authService.checkAuth().pipe(
    map((user) =>
    {
      if(user)
      {
        return true;
      }
      else
      {
        router.navigate(['/login'], { 
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    })
  );
};