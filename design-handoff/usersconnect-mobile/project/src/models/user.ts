export interface User {
  _id: string;
  name: string;
  email: string;
  isEmailPublic: boolean;
  isEmailVerified: boolean;
  avatarURL: string;
  isAdmin: boolean;
}

export interface MinimalUser {
  _id: string;
  name: string;
  avatarURL: string;
};