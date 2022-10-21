import { User } from './user.models';

export type Badge = {
  clock: 'in' | 'out';
  timestamp: string;
  user: User;
}

export interface BadgeWithKey extends Badge {
  key: string;
}

export type BadgeForm = Partial<Badge>;
