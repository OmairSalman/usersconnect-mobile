import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonSpinner,
} from '@ionic/angular/standalone';

import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonSpinner,
    PostCardComponent,
  ],
})
export class PostDetailPage implements OnInit {
  authService = inject(AuthService);
  private postService = inject(PostService);
  private route = inject(ActivatedRoute);

  post = signal<Post | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadPost(id);
  }

  loadPost(id: string) {
    this.loading.set(true);
    this.postService.getPost(id).subscribe({
      next: (post) => {
        this.post.set(post);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Post load failed:', err);
        this.error.set('Failed to load post');
        this.loading.set(false);
      },
    });
  }

  onPostUpdated(updated: Post) {
    this.post.set(updated);
  }

  onPostDeleted(_postId: string) {
    history.back();
  }
}
