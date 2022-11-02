import { DocumentReference, Timestamp } from '@angular/fire/firestore';

export interface DbBadge {
  clock?: 'in' | 'out';
  timestamp?: Timestamp | Date;
  user?: DocumentReference<DbBadgeUser>;
}

export type DbBadgeWithKey = DbBadge & {
  key: string;
};

export interface DbBadgeUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export type BadgeUser = DbBadgeUser;

export type Badge = Omit<DbBadge, 'user' | 'timestamp'> & {
  timestamp: string;
  user?: BadgeUser;
}

export type BadgeWithKey = Badge & {
  key: string;
}

export type BadgeForm = Partial<{
  clock: DbBadge["clock"];
  userId: DbBadgeUser["uid"];
  timestamp: string;
}>
