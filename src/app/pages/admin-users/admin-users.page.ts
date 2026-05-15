import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonSearchbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonBadge,
  IonSpinner,
  ActionSheetController,
} from '@ionic/angular/standalone';

import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonSearchbar,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonBadge,
    IonSpinner,
  ],
})
export class AdminUsersPage implements OnInit {
  authService = inject(AuthService);
  private userService = inject(UserService);
  private actionSheetCtrl = inject(ActionSheetController);
  private router = inject(Router);

  allUsers = signal<User[]>([]);
  loading = signal(true);
  error = signal('');
  searchTerm = signal('');
  processingId = signal<string | null>(null);

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.allUsers();
    return this.allUsers().filter(
      u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Users load failed:', err);
        this.error.set('Failed to load users');
        this.loading.set(false);
      },
    });
  }

  onSearch(event: any) {
    this.searchTerm.set(event.detail.value || '');
  }

  viewProfile(userId: string) {
    this.router.navigate(['/tabs/profile', userId]);
  }

  async onUserActions(user: User) {
    const currentUser = this.authService.currentUser();
    const buttons: any[] = [
      {
        text: 'View Profile',
        handler: () => this.viewProfile(user._id),
      },
      {
        text: user.isAdmin ? 'Remove Admin' : 'Make Admin',
        handler: () => this.toggleAdmin(user),
      },
      {
        text: 'Delete User',
        role: 'destructive',
        handler: () => this.confirmDeleteUser(user),
      },
      { text: 'Cancel', role: 'cancel' },
    ];

    const sheet = await this.actionSheetCtrl.create({
      header: user.name,
      subHeader: user.email,
      buttons,
    });
    await sheet.present();
  }

  toggleAdmin(user: User) {
    this.processingId.set(user._id);
    this.userService.toggleAdmin(user._id).subscribe({
      next: (res) => {
        this.allUsers.update(users => users.map(u => u._id === user._id ? res.user : u));
        this.processingId.set(null);
      },
      error: (err) => {
        console.error('Toggle admin failed:', err);
        this.processingId.set(null);
      },
    });
  }

  async confirmDeleteUser(user: User) {
    const sheet = await this.actionSheetCtrl.create({
      header: `Delete ${user.name}?`,
      subHeader: 'This action cannot be undone.',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.deleteUser(user),
        },
        { text: 'Cancel', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  deleteUser(user: User) {
    this.processingId.set(user._id);
    this.userService.deleteUser(user._id).subscribe({
      next: () => {
        this.allUsers.update(users => users.filter(u => u._id !== user._id));
        this.processingId.set(null);
      },
      error: (err) => {
        console.error('Delete user failed:', err);
        this.processingId.set(null);
      },
    });
  }
}
