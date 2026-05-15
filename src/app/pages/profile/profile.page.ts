import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  createOutline,
  peopleOutline,
  logOutOutline,
  chevronForwardOutline,
  checkmarkCircle,
  alertCircle,
  globeOutline,
  lockClosedOutline,
  shieldOutline,
} from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonSpinner,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    PostCardComponent,
  ],
})
export class ProfilePage implements OnInit {
  authService = inject(AuthService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  profileUser = signal<User | null>(null);
  posts = signal<Post[]>([]);
  postsLikes = signal(0);
  commentsLikes = signal(0);
  loading = signal(true);
  error = signal('');

  isOwnProfile = signal(false);

  constructor() {
    addIcons({
      createOutline,
      peopleOutline,
      logOutOutline,
      chevronForwardOutline,
      checkmarkCircle,
      alertCircle,
      globeOutline,
      lockClosedOutline,
      shieldOutline,
    });
  }

  ngOnInit() {
    combineLatest([this.route.paramMap]).subscribe(([params]) => {
      const id = params.get('id');
      const currentUser = this.authService.currentUser();
      const userId = id || currentUser?._id;
      this.isOwnProfile.set(!id || id === currentUser?._id);
      if (userId) this.loadProfile(userId);
    });
  }

  loadProfile(userId: string) {
    this.loading.set(true);
    this.userService.getUserProfile(userId).subscribe({
      next: (data) => {
        this.profileUser.set(data.user);
        this.posts.set(data.posts);
        this.postsLikes.set(data.postsLikes);
        this.commentsLikes.set(data.commentsLikes);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Profile load failed:', err);
        this.error.set('Failed to load profile');
        this.loading.set(false);
      },
    });
  }

  onPostUpdated(updated: Post) {
    this.posts.update(posts => posts.map(p => p._id === updated._id ? updated : p));
  }

  onPostDeleted(postId: string) {
    this.posts.update(posts => posts.filter(p => p._id !== postId));
  }

  goToEditProfile() {
    this.router.navigate(['/tabs/profile/edit']);
  }

  goToAdminUsers() {
    this.router.navigate(['/tabs/admin/users']);
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
