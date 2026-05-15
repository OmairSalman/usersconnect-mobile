import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonIcon,
  IonSpinner,
  IonTextarea,
  ActionSheetController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { thumbsUp, thumbsDown, pencilOutline, trashOutline } from 'ionicons/icons';

import { Comment } from '../../models/comment';
import { MinimalUser, User } from '../../models/user';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IonIcon, IonSpinner, IonTextarea],
})
export class CommentCardComponent implements OnInit {
  @Input() comment!: Comment;
  @Input() currentUser!: User;
  @Output() commentUpdated = new EventEmitter<Comment>();
  @Output() commentDeleted = new EventEmitter<string>();

  private fb = inject(FormBuilder);
  private commentService = inject(CommentService);
  private actionSheetCtrl = inject(ActionSheetController);

  loading = signal(false);
  editing = signal(false);
  editForm!: FormGroup;

  constructor() {
    addIcons({ thumbsUp, thumbsDown, pencilOutline, trashOutline });
  }

  ngOnInit() {
    this.editForm = this.fb.group({
      content: [this.comment.content, [Validators.required, Validators.maxLength(500)]],
    });
  }

  isAuthorized(): boolean {
    if (!this.currentUser) return false;
    return this.comment.author._id === this.currentUser._id || this.currentUser.isAdmin;
  }

  isLiked(users: MinimalUser[]): boolean {
    if (!this.currentUser || !users) return false;
    return users.some(u => u._id === this.currentUser._id);
  }

  onLike() {
    const liked = this.isLiked(this.comment.likes);
    const req = liked
      ? this.commentService.unlike(this.comment._id)
      : this.commentService.like(this.comment._id);

    req.subscribe({
      next: (res) => this.commentUpdated.emit({ ...this.comment, likes: res.likes, dislikes: res.dislikes }),
      error: (err) => console.error('Comment like failed:', err),
    });
  }

  onDislike() {
    const disliked = this.isLiked(this.comment.dislikes);
    const req = disliked
      ? this.commentService.undislike(this.comment._id)
      : this.commentService.dislike(this.comment._id);

    req.subscribe({
      next: (res) => this.commentUpdated.emit({ ...this.comment, likes: res.likes, dislikes: res.dislikes }),
      error: (err) => console.error('Comment dislike failed:', err),
    });
  }

  onEdit() {
    this.editing.set(true);
  }

  onSaveEdit() {
    if (!this.editForm.valid) return;
    this.loading.set(true);
    this.commentService.updateComment(this.comment._id, this.editForm.value.content).subscribe({
      next: (res) => {
        this.commentUpdated.emit(res.comment);
        this.editing.set(false);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Comment update failed:', err);
        this.loading.set(false);
      },
    });
  }

  onCancelEdit() {
    this.editForm.patchValue({ content: this.comment.content });
    this.editing.set(false);
  }

  async onDelete() {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Delete this comment?',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.loading.set(true);
            this.commentService.deleteComment(this.comment._id).subscribe({
              next: () => {
                this.commentDeleted.emit(this.comment._id);
                this.loading.set(false);
              },
              error: (err) => {
                console.error('Comment delete failed:', err);
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
}
