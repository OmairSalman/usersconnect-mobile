import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
    canActivate: [guestGuard],
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      {
        path: 'feed',
        loadComponent: () => import('./pages/feed/feed.page').then(m => m.FeedPage),
      },
      {
        path: 'post/:id',
        loadComponent: () => import('./pages/post-detail/post-detail.page').then(m => m.PostDetailPage),
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/create-post/create-post.page').then(m => m.CreatePostPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
      },
      // profile/edit must be before profile/:id so "edit" isn't captured as an ID
      {
        path: 'profile/edit',
        loadComponent: () => import('./pages/edit-profile/edit-profile.page').then(m => m.EditProfilePage),
      },
      {
        path: 'profile/:id',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: 'admin/users',
        loadComponent: () => import('./pages/admin-users/admin-users.page').then(m => m.AdminUsersPage),
        canActivate: [adminGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
