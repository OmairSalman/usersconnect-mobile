import { Component, inject, OnInit, signal } from '@angular/core';
import { User } from '../../../models/user';
import { Post } from '../../../models/post';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from '../../components/post-card/post-card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { ConfigService } from '../../services/config';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, PostCardComponent, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit
{
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private configService = inject(ConfigService);

  authService = inject(AuthService);
  posts = signal<Post[]>([]);
  user = signal<User | null>(null);
  loading = signal(true);
  error = signal('');
  postsLikes = signal(0);
  commentsLikes = signal(0);
  page = signal(1);
  totalPages = signal(1);
  limit = signal(10);
  s3Enabled = signal<boolean>(false);

  ngOnInit()
  {
    combineLatest([
      this.route.paramMap,
      this.route.queryParams
    ]).subscribe(([params, queryParams]) =>{
      const userId = params.get('id');
      this.page.set(queryParams['page'] ? +queryParams['page'] : 1);
      this.limit.set(queryParams['limit'] ? +queryParams['limit'] : 10);
      
      if (userId) {
        this.loadUserProfile(userId);
      } else {
        this.loadUserProfile(this.authService.currentUser()!._id);
      }

      this.s3Enabled.set(this.configService.isS3Enabled());
    });
  }

  loadUserProfile(userId: string)
  {
    this.loading.set(true);
    this.userService.getUserProfile(userId, this.page(), this.limit()).subscribe(
      {
        next: (data) =>
        {
          this.user.set(data.user);
          this.posts.set(data.posts);
          this.totalPages.set(data.totalPages);
          this.postsLikes.set(data.postsLikes);
          this.commentsLikes.set(data.commentsLikes);
          this.loading.set(false);
        },
        error: (err) =>
        {
          console.error('Error loading user profile:', err);
          this.error.set('Failed to load user profile');
          this.loading.set(false);
        }
      }
    );
  }

  getPageNumbers(): number[]
  {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  onPostUpdated(updatedPost: Post) {
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

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}