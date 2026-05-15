import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonButton,
} from '@ionic/angular/standalone';

import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonButton,
    PostCardComponent,
  ],
})
export class FeedPage implements OnInit {
  private postService = inject(PostService);
  authService = inject(AuthService);

  posts = signal<Post[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.loadFeed();
  }

  loadFeed(event?: any) {
    this.loading.set(true);
    this.error.set('');
    this.postService.getFeed(1, 20).subscribe({
      next: (data) => {
        this.posts.set(data.posts);
        this.loading.set(false);
        event?.target?.complete();
      },
      error: (err) => {
        console.error('Error loading feed:', err);
        this.error.set('Failed to load feed');
        this.loading.set(false);
        event?.target?.complete();
      },
    });
  }

  handleRefresh(event: any) {
    this.loadFeed(event);
  }

  onPostUpdated(updatedPost: Post) {
    this.posts.update(posts => posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  }

  onPostDeleted(postId: string) {
    this.posts.update(posts => posts.filter(p => p._id !== postId));
  }
}
