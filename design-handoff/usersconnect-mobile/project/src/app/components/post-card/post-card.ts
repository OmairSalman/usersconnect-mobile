import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../models/post';
import { Comment } from '../../../models/comment'
import { MinimalUser, User } from '../../../models/user';
import { CommentCardComponent } from '../comment-card/comment-card';
import { RouterLink } from '@angular/router';
import { PostService } from '../../services/post';
import { inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment';
import { ModalService } from '../../services/modal';

@Component({
  selector: 'app-post-card',
  imports: [CommonModule, FormsModule, CommentCardComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css'
})
export class PostCardComponent implements OnInit
{
  @Input() post!: Post;
  @Input() currentUser!: User;
  @Input() s3Enabled: boolean = false;

  @Output() postUpdated = new EventEmitter<Post>();  // ✅ Emit updates to parent
  @Output() postDeleted = new EventEmitter<string>();

  private modalService = inject(ModalService);
  private postService = inject(PostService);
  private commentService = inject(CommentService);
  private fb = inject(FormBuilder);

  loading = signal(false);
  editing = signal(false);
  editForm!: FormGroup;
  commentContent = '';

  ngOnInit()
  {
    this.editForm = this.fb.group({
      title: [this.post.title, [Validators.required, Validators.maxLength(100)]],
      content: [this.post.content, [Validators.required, Validators.maxLength(1000)]]
    })
  }

  // Helper: Check if user can edit/delete
  isAuthorized(): boolean {
    if (!this.currentUser) return false;
    return this.post.author._id === this.currentUser._id || this.currentUser.isAdmin;
  }

  // Helper: Check if user liked
  isLiked(users: MinimalUser[]): boolean
  {
    if (!this.currentUser || !users) return false;
    return users.some(u => u._id === this.currentUser._id);
  }

  onLike()
  {
    const isCurrentlyLiked = this.isLiked(this.post.likes);
    
    const request = isCurrentlyLiked 
      ? this.postService.unlike(this.post._id)
      : this.postService.like(this.post._id);
      
    request.subscribe({
      next: (response) => {
        // ✅ Create updated post and emit to parent
        const updatedPost: Post = {
          ...this.post,
          likes: response.likes,
          dislikes: response.dislikes
        };
        this.postUpdated.emit(updatedPost);
      },
      error: (err) => {
        console.error('Like action failed:', err);
      }
    });
  }

  onDislike()
  {
    const isCurrentlyDisliked = this.isLiked(this.post.dislikes);
    
    const request = isCurrentlyDisliked 
      ? this.postService.undislike(this.post._id)
      : this.postService.dislike(this.post._id);
      
    request.subscribe({
      next: (response) => {
        // ✅ Create updated post and emit to parent
        const updatedPost: Post = {
          ...this.post,
          likes: response.likes,
          dislikes: response.dislikes
        };
        this.postUpdated.emit(updatedPost);
      },
      error: (err) => {
        console.error('Dislike action failed:', err);
      }
    });
  }

  onEdit()
  {
    this.editing.set(true);
  }

  onSaveEdit()
  {
    if (this.editForm.valid)
    {
      this.loading.set(true);
      const { title, content } = this.editForm.value;
      this.postService.updatePost(this.post._id, title!, content!).subscribe({
        next:(response) =>
        {
          this.postUpdated.emit(response.post);
          this.editing.set(false);
          this.loading.set(false);
        },
        error: (err) =>
        {
          console.error('Update failed:', err);
          this.loading.set(false);
        }
      })
    }
    else
    {
      console.error('edit form invalid');
    }
  }

  onCancelEdit()
  {
    // Reset form to original values
    this.editForm.patchValue({
      title: this.post.title,
      content: this.post.content
    });
    this.editing.set(false);
  }

  onDelete()
  {
    const message = this.post.imageURL 
      ? 'Are you sure you want to delete this post? The attached image will also be permanently deleted. This action cannot be undone!'
      : 'Are you sure you want to delete this post? This action cannot be undone!';
    
    // ✅ Show confirm modal with callback
    this.modalService.showConfirmModal(message, 'post', () => {
      this.loading.set(true);
      this.postService.deletePost(this.post._id).subscribe({
        next: (response) => {
          this.postDeleted.emit(this.post._id);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.loading.set(false);
        }
      });
    });
  }

  onAddComment()
  {
    if(this.commentContent)
    {
      this.loading.set(true);
      this.commentService.saveComment(this.post._id, this.commentContent).subscribe({
        next:(response) =>
        {
          this.post.comments = [response.comment, ...this.post.comments];
          this.postUpdated.emit(this.post);
          this.commentContent = '';
          this.loading.set(false);
        },
        error: (err) =>
        {
          console.error('Comment creation error:', err);
          this.loading.set(false);
        }
      })
      
    }
  }

  onCommentUpdated(updatedComment: Comment)
  {
    this.post.comments = this.post.comments.map(comment => (comment._id === updatedComment._id) ? updatedComment : comment);
    this.postUpdated.emit(this.post);
  }

  onCommentDeleted(commentId: string)
  {
    this.post.comments = this.post.comments.filter(c => c._id !== commentId);
    this.postUpdated.emit(this.post);
  }
}