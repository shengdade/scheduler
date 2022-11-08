export type Recurring = 'none' | 'daily' | 'weekly';

export interface Job {
  jobId: string;
  payload: string;
  minute: number;
  recurring: Recurring;
  immediate: boolean;
}
