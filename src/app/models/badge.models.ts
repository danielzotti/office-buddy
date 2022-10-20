export interface Badge {
  clock: 'in' | 'out';
  timestamp: string;
  username: string;
}

export interface BadgeWithKey extends Badge {
  key: string;
}

export type BadgeForm = Partial<Badge>;
