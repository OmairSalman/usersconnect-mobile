import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  thumbsUpOutline, 
  thumbsDownOutline, 
  chatbubbleOutline,
  thumbsUp,
  thumbsDown
} from 'ionicons/icons';

import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonBadge
  ]
})
export class FeedPage implements OnInit {
  private postService = inject(PostService);

  // Signals for reactive state
  posts = signal<Post[]>([]);
  loading = signal(true);
  error = signal('');

  constructor() {
    // Register icons for use in template
    addIcons({ 
      thumbsUpOutline, 
      thumbsDownOutline, 
      chatbubbleOutline,
      thumbsUp,
      thumbsDown
    });
  }

  ngOnInit() {
    this.loadFeed();
  }

  loadFeed(event?: any) {
    this.loading.set(true);
    
    // Fetch first page (10 posts)
    this.postService.getFeed(1, 10).subscribe({
      next: (data) => {
        this.posts.set(data.posts);
        this.loading.set(false);
        
        // Complete pull-to-refresh if triggered
        if (event) {
          event.target.complete();
        }
      },
      error: (err) => {
        console.error('Error loading feed:', err);
        this.error.set('Failed to load feed');
        this.loading.set(false);
        
        if (event) {
          event.target.complete();
        }
      }
    });
  }

  // Pull to refresh handler
  handleRefresh(event: any) {
    this.loadFeed(event);
  }

  // Check if current user liked a post
  // Note: For now returns false since we don't have auth
  // You'll add this when you implement login
  isLiked(post: Post): boolean {
    return false;
  }

  isDisliked(post: Post): boolean {
    return false;
  }

  // Placeholder for like action
  onLike(post: Post) {
    console.log('Like post:', post._id);
    // TODO: Implement when auth is ready
  }

  onDislike(post: Post) {
    console.log('Dislike post:', post._id);
    // TODO: Implement when auth is ready
  }

  onViewComments(post: Post) {
    console.log('View comments for post:', post._id);
    // TODO: Navigate to comments page
  }
}