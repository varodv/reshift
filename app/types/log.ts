import type { Activity } from './activity';
import type { Entity } from './entity';

export type Log = Entity<{
  activity: Activity['id'] | 'STOP';
  timestamp: number;
}>;
