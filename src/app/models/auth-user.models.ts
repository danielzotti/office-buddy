export interface AuthUser {
  email?: string;
  displayName?: string;
  isAdmin?: boolean;
}

export interface AuthUserWithKey extends AuthUser {
  key: string;
}
