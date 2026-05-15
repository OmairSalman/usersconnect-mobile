import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonToggle,
  IonButton,
  IonSpinner,
  IonText,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonToggle,
    IonButton,
    IonSpinner,
    IonText,
    IonItem,
    IonLabel,
  ],
})
export class EditProfilePage implements OnInit {
  authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  profileSaving = signal(false);
  profileSuccess = signal('');
  profileError = signal('');

  passwordSaving = signal(false);
  passwordSuccess = signal('');
  passwordError = signal('');

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  ngOnInit() {
    const user = this.authService.currentUser();
    this.profileForm = this.fb.group({
      name: [user?.name || '', [Validators.required, Validators.minLength(2)]],
      isEmailPublic: [user?.isEmailPublic ?? false],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  get name() { return this.profileForm.get('name'); }
  get currentPassword() { return this.passwordForm.get('currentPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }

  onSaveProfile() {
    if (this.profileForm.invalid) return;
    this.profileSaving.set(true);
    this.profileSuccess.set('');
    this.profileError.set('');

    const { name, isEmailPublic } = this.profileForm.value;
    this.userService.updateProfile({ name, isEmailPublic }).subscribe({
      next: (res) => {
        this.authService.currentUser.set(res.user);
        this.profileSuccess.set('Profile updated successfully');
        this.profileSaving.set(false);
      },
      error: (err) => {
        this.profileError.set(err.error?.message || 'Failed to update profile');
        this.profileSaving.set(false);
      },
    });
  }

  onChangePassword() {
    if (this.passwordForm.invalid) return;
    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.passwordError.set('Passwords do not match');
      return;
    }
    this.passwordSaving.set(true);
    this.passwordSuccess.set('');
    this.passwordError.set('');

    const { currentPassword } = this.passwordForm.value;
    this.userService.changePassword(currentPassword!, newPassword!, confirmPassword!).subscribe({
      next: () => {
        this.passwordSuccess.set('Password changed successfully');
        this.passwordForm.reset();
        this.passwordSaving.set(false);
      },
      error: (err) => {
        this.passwordError.set(err.error?.message || 'Failed to change password');
        this.passwordSaving.set(false);
      },
    });
  }
}
