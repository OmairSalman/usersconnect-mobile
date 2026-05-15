import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonInput,
  IonTextarea,
  IonButton,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';

import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonInput,
    IonTextarea,
    IonButton,
    IonSpinner,
    IonText,
  ],
})
export class CreatePostPage {
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  postForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    content: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  get title() { return this.postForm.get('title'); }
  get content() { return this.postForm.get('content'); }

  onSubmit() {
    if (this.postForm.invalid) return;
    this.loading.set(true);
    this.error.set('');
    const { title, content } = this.postForm.value;

    this.postService.createPost(title!, content!).subscribe({
      next: () => {
        this.loading.set(false);
        this.postForm.reset();
        this.router.navigate(['/tabs/feed']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to create post');
      },
    });
  }
}
