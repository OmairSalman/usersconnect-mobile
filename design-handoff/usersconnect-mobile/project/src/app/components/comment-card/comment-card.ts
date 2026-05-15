import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../../models/comment';
import { MinimalUser, User } from '../../../models/user';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment';
import { ModalService } from '../../services/modal';

@Component({
  selector: 'app-comment-card',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './comment-card.html',
  styleUrl: './comment-card.css'
})
export class CommentCardComponent implements OnInit
{
  @Input() comment!: Comment;
  @Input() currentUser!: User;

  @Output() commentUpdated = new EventEmitter<Comment>;
  @Output() commentDeleted = new EventEmitter<string>();

  private fb = inject(FormBuilder);
  private commentService = inject(CommentService);
  private modalService = inject(ModalService);

  loading = signal(false);
  editing = signal(false);
  editForm!: FormGroup;

  ngOnInit()
  {
    this.editForm = this.fb.group({
      content: [this.comment.content, [Validators.required, Validators.maxLength(500)]]
    })
  }

  // Helper method to check if user can edit/delete
  isAuthorized(): boolean {
    if (!this.currentUser) return false;
    return this.comment.author._id === this.currentUser._id || this.currentUser.isAdmin;
  }

  // Helper method to check if user liked
  isLiked(users: MinimalUser[]): boolean {
    if (!this.currentUser || !users) return false;
    return users.some(u => u._id === this.currentUser._id);
  }

  // Placeholder methods (we'll implement these later)
  onLike()
  {
    const isCurrentlyLiked = this.isLiked(this.comment.likes);

    const request = isCurrentlyLiked 
      ? this.commentService.unlike(this.comment._id)
      : this.commentService.like(this.comment._id);
      
    request.subscribe({
      next: (response) => {
        const updatedComment: Comment = {
          ...this.comment,
          likes: response.likes,
          dislikes: response.dislikes
        };
        this.commentUpdated.emit(updatedComment);
      },
      error: (err) => {
        console.error('Like action failed:', err);
      }
    });
  }

 onDislike()
   {
     const isCurrentlyDisliked = this.isLiked(this.comment.dislikes);
     
     const request = isCurrentlyDisliked 
       ? this.commentService.undislike(this.comment._id)
       : this.commentService.dislike(this.comment._id);
       
     request.subscribe({
       next: (response) => {
         // ✅ Create updated post and emit to parent
         const updatedComment: Comment = {
           ...this.comment,
           likes: response.likes,
           dislikes: response.dislikes
         };
         this.commentUpdated.emit(updatedComment);
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
    if(this.editForm.valid)
    {
      this.loading.set(true);
      const { content } = this.editForm.value;
      this.commentService.updateComment(this.comment._id, content).subscribe({
        next:(response) => 
        {
          this.commentUpdated.emit(response.comment);
          this.editing.set(false);
          this.loading.set(false);
        },
        error:(err) =>
        {
          console.log('error editing comment:', err);
          this.loading.set(false);
        }
      });
    }
  }

  onCancelEdit()
  {
    // Reset form to original values
    this.editForm.patchValue({
      content: this.comment.content
    });
    this.editing.set(false);
  }

  onDelete() {
    this.modalService.showConfirmModal(
      'Are you sure you want to delete this comment? This action cannot be undone!',
      'comment',
      () => {
        this.loading.set(true);
        this.commentService.deleteComment(this.comment._id).subscribe({
          next: (response) => {
            this.commentDeleted.emit(this.comment._id);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Delete failed:', err);
            this.loading.set(false);
          }
        });
      }
    );
  }
}