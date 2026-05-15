import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';
import { ConfigService } from './services/config';
import { EmailVerificationModal } from './components/email-verification-modal/email-verification-modal';
import { PleaseVerifyModal } from './components/please-verify-modal/please-verify-modal';
import { ModalService } from './services/modal';
import { ConfirmModal } from './components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink, PleaseVerifyModal, EmailVerificationModal, ConfirmModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit
{
  authService = inject(AuthService);
  configService = inject(ConfigService);
  modalService = inject(ModalService);
  private router = inject(Router);
  
  ngOnInit()
  {
    this.authService.checkAuth().subscribe();
    this.configService.checkConfig().subscribe();
  }
  currentUser = this.authService.currentUser;
  title = 'usersconnect-ng';

  onLogout()
  {
    this.authService.logout().subscribe({
      next:(response) =>
      {
        console.log(this.authService.currentUser());
        this.router.navigate(['/']);
      },
      error:(err) =>
      {
        console.error('Logout failed:', err);
      }
    });
  }
}