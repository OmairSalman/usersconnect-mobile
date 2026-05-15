import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit
{
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(false);
  email = '';
  password = '';
  
  ngOnInit()
  {
    this.authService.authError.set('');
  }

  onSubmit()
  {
    this.loading.set(true);
    if(!this.email || !this.password)
    {
      this.authService.authError.set('Please enter both email and password');
      this.loading.set(false);
      return;
    }
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/feed';
    this.authService.login(this.email, this.password).subscribe({
      next:(data) =>
      {
        if(data.user)
        {
          this.authService.currentUser.set(data.user);
          this.router.navigate([returnUrl]);
          this.loading.set(false);
        }
      },
      error:(err) =>
      {
        const errorMsg = err.error?.error || err.error?.message || 'Login failed';
        console.error('Login failed:', err);
        this.authService.authError.set(errorMsg);
        this.loading.set(false);
      }
    });
  }
}