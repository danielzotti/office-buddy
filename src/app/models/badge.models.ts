export interface BadgeUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface Badge {
  clock: 'in' | 'out';
  timestamp: string;
  user: BadgeUser;
}

export interface BadgeWithKey extends Badge {
  key: string;
}

export type BadgeForm = Partial<Badge>;
