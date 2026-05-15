import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonIcon,
  IonSpinner,
  ActionSheetController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  thumbsUp,
  thumbsDown,
  chatbubbleOutline,
  pencilOutline,
  trashOutline,
  sendOutline,
} from 'ionicons/icons';

import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import { MinimalUser, User } from '../../models/user';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { CommentCardComponent } from '../comment-card/comment-card.component';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonIcon,
    IonSpinner,
    CommentCardComponent,
  ],
})
export class PostCardComponent implements OnInit {
  @Input() post!: Post;
  @Input() currentUser!: User;
  /** When true, shows inline comment thread + add-comment form (PostDetailPage mode) */
  @Input() showComments = false;
  @Output() postUpdated = new EventEmitter<Post>();
  @Output() postDeleted = new EventEmitter<string>();

  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private commentService = inject(CommentService);
  private actionSheetCtrl = inject(ActionSheetController);
  private router = inject(Router);

  loading = signal(false);
  editing = signal(false);
  commentContent = '';
  editForm!: FormGroup;

  constructor() {
    addIcons({ thumbsUp, thumbsDown, chatbubbleOutline, pencilOutline, trashOutline, sendOutline });
  }

  ngOnInit() {
    this.editForm = this.fb.group({
      title: [this.post.title, [Validators.required, Validators.maxLength(100)]],
      content: [this.post.content, [Validators.required, Validators.maxLength(1000)]],
    });
  }

  isAuthorized(): boolean {
    if (!this.currentUser) return false;
    return this.post.author._id === this.currentUser._id || this.currentUser.isAdmin;
  }

  isLiked(users: MinimalUser[]): boolean {
    if (!this.currentUser || !users) return false;
    return users.some(u => u._id === this.currentUser._id);
  }

  onCardClick() {
    if (!this.showComments && !this.editing()) {
      this.router.navigate(['/tabs/post', this.post._id]);
    }
  }

  onAuthorClick(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/tabs/profile', this.post.author._id]);
  }

  onLike(event: Event) {
    event.stopPropagation();
    const liked = this.isLiked(this.post.likes);
    const req = liked
      ? this.postService.unlike(this.post._id)
      : this.postService.like(this.post._id);

    req.subscribe({
      next: (res) => this.postUpdated.emit({ ...this.post, likes: res.likes, dislikes: res.dislikes }),
      error: (err) => console.error('Post like failed:', err),
    });
  }

  onDislike(event: Event) {
    event.stopPropagation();
    const disliked = this.isLiked(this.post.dislikes);
    const req = disliked
      ? this.postService.undislike(this.post._id)
      : this.postService.dislike(this.post._id);

    req.subscribe({
      next: (res) => this.postUpdated.emit({ ...this.post, likes: res.likes, dislikes: res.dislikes }),
      error: (err) => console.error('Post dislike failed:', err),
    });
  }

  onViewComments(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/tabs/post', this.post._id]);
  }

  onEdit(event: Event) {
    event.stopPropagation();
    this.editing.set(true);
  }

  onSaveEdit() {
    if (!this.editForm.valid) return;
    this.loading.set(true);
    const { title, content } = this.editForm.value;
    this.postService.updatePost(this.post._id, title!, content!).subscribe({
      next: (res) => {
        this.postUpdated.emit(res.post);
        this.editing.set(false);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Post update failed:', err);
        this.loading.set(false);
      },
    });
  }

  onCancelEdit() {
    this.editForm.patchValue({ title: this.post.title, content: this.post.content });
    this.editing.set(false);
  }

  async onDelete(event: Event) {
    event.stopPropagation();
    const sheet = await this.actionSheetCtrl.create({
      header: 'Delete this post?',
      subHeader: 'This action cannot be undone.',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.loading.set(true);
            this.postService.deletePost(this.post._id).subscribe({
              next: () => {
                this.postDeleted.emit(this.post._id);
                this.loading.set(false);
              },
              error: (err) => {
                console.error('Post delete failed:', err);
                this.loading.set(false);
              },
            });
          },
        },
        { text: 'Cancel', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  onAddComment() {
    if (!this.commentContent.trim()) return;
    this.loading.set(true);
    this.commentService.saveComment(this.post._id, this.commentContent).subscribe({
      next: (res) => {
        const updated = { ...this.post, comments: [res.comment, ...this.post.comments] };
        this.postUpdated.emit(updated);
        this.commentContent = '';
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Comment creation failed:', err);
        this.loading.set(false);
      },
    });
  }

  onCommentUpdated(updatedComment: Comment) {
    const comments = this.post.comments.map(c => c._id === updatedComment._id ? updatedComment : c);
    this.postUpdated.emit({ ...this.post, comments });
  }

  onCommentDeleted(commentId: string) {
    const comments = this.post.comments.filter(c => c._id !== commentId);
    this.postUpdated.emit({ ...this.post, comments });
  }
}
