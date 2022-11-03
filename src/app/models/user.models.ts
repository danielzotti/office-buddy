export interface DbUser {
  email?: string;
  displayName?: string;
  isAdmin?: boolean;
}

export type DbUserWithKey = DbUser & {
  key: string;
}

export type User = DbUser;
export type UserWithKey = DbUserWithKey;

