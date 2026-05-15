import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post';
import { Post } from '../../../models/post';
import { PostCardComponent } from '../../components/post-card/post-card';
import { AuthService } from '../../services/auth';
import { ConfigService } from '../../services/config';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreatePostForm } from '../../components/create-post-form/create-post-form';

@Component({
  selector: 'app-feed',
  imports: [CommonModule, PostCardComponent, RouterLink, CreatePostForm],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed implements OnInit
{
  private postService = inject(PostService);
  private configService = inject(ConfigService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authService = inject(AuthService);
  page = signal(1);
  totalPages = signal(1);
  limit = signal(10);
  posts = signal<Post[]>([]);
  s3Enabled = signal(true);

  loading = signal(true);
  error = signal('');

  ngOnInit()
  {
    this.route.queryParams.subscribe((params) => {
      this.page.set(params['page'] ? +params['page'] : 1);
      this.limit.set(params['limit'] ? +params['limit'] : 10);
      this.loadFeed();
      this.s3Enabled.set(this.configService.isS3Enabled());
    });
  }

  loadFeed()
  {
    this.postService.getFeed(this.page(), this.limit()).subscribe(
      {
        next: (data) =>
        {
          this.posts.set(data.posts);
          this.totalPages.set(data.totalPages);
          this.loading.set(false);
        },
        error: (err: string) =>
        {
          console.error('Error loading posts:', err);
          this.error.set('Failed loading posts');
          this.loading.set(false);
        }
      }
    )
  }

  getPageNumbers(): number[]
  {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  onPostUpdated(updatedPost: Post)
  {
    // Find the post in the array and update it
    this.posts.update(posts => {
      const index = posts.findIndex(p => p._id === updatedPost._id);
      if (index !== -1) {
        // Create new array with updated post
        const newPosts = [...posts];
        newPosts[index] = updatedPost;
        return newPosts;
      }
      return posts;
    });
  }

  onPostCreated(newPost: Post)
  {
    if(this.page() === 1)
    {
      this.posts.update(posts => [newPost, ...posts].slice(0, 10));
    }
    else
    {
      this.router.navigate(['/feed'], { queryParams: { page: 1 } });
    }
  }

  onPostDeleted(postId: string)
  {
    // Remove from UI immediately for instant feedback
    this.posts.update(posts => posts.filter(p => p._id !== postId));
    
    // Reload page to get correct number of posts
    setTimeout(() => {
      if (this.posts().length === 0 && this.page() > 1) {
        // Page is empty, go to previous page
        this.router.navigate(['/feed'], { 
          queryParams: { page: this.page() - 1 } 
        });
      } else {
        // Reload current page to backfill from next page
        this.loadFeed();
      }
    }, 500);
  }
  
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}