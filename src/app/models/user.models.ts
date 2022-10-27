export interface User {
  email?: string;
  displayName?: string;
  isAdmin?: boolean;
}

export interface UserWithKey extends User {
  key: string;
}
