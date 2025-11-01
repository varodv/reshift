import type { Entity } from './entity';

export type Activity = Entity<{
  name: string;
  color: string;
  schedule: Array<{
    weekdays: Array<0 | 1 | 2 | 3 | 4 | 5 | 6>;
    minHours?: number;
    maxHours?: number;
  }>;
}>;
