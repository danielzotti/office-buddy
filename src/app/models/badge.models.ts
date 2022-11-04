import { Timestamp } from '@angular/fire/firestore';

export interface DbBadge {
  clock?: 'in' | 'out';
  timestamp?: Timestamp | Date;
  userId: string;
  key?: string;
}

export interface DbBadgeUser {
  key?: string;
  email: string | null;
  displayName: string | null;
}

export type BadgeUser = DbBadgeUser;

export type Badge = Omit<DbBadge, 'user' | 'timestamp'> & {
  timestamp: string;
  user?: BadgeUser;
}

export type BadgeForm = Partial<{
  clock: DbBadge["clock"];
  userId: string;
  timestamp: string;
}>
