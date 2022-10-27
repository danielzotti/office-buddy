export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export type AuthUser = FirebaseUser & {
  isAdmin?: boolean;
  isAuthorized?: boolean;
}
