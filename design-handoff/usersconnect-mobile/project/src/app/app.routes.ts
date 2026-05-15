import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Privacy } from './pages/privacy/privacy';
import { Terms } from './pages/terms/terms';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { Feed } from './pages/feed/feed';
import { Profile } from './pages/profile/profile';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { AdminUsers } from './pages/admin-users/admin-users';
import { adminGuard } from './guards/admin-guard';
import { ResetPassword } from './pages/reset-password/reset-password';
import { ResetPasswordConfirm } from './pages/reset-password-confirm/reset-password-confirm';

export const routes: Routes = [
    { path: '', component: Home, canActivate: [guestGuard] },
    { path: 'about', component: About },
    { path: 'privacy', component: Privacy },
    { path: 'terms', component: Terms },
    { path: 'contact', component: Contact },

    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: 'register', component: Register, canActivate: [guestGuard] },
    { path: 'forgot-password', component: ForgotPassword, canActivate: [guestGuard] },
    { path: 'reset-password', component: ResetPassword, canActivate: [guestGuard] },
    { path: 'reset-password/confirm', component: ResetPasswordConfirm, canActivate: [guestGuard] },

    { path: 'feed', component: Feed, canActivate: [authGuard] },
    { path: 'profile', component: Profile, canActivate: [authGuard] },
    { path: 'profile/:id', component: Profile, canActivate: [authGuard] },
    { path: 'admin/users', component: AdminUsers, canActivate: [adminGuard] },
];
