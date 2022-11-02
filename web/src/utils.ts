import dayjs from 'dayjs';
import { Recurring } from './types';

export const getMinuteDisplay = (minute: number): string => {
  return dayjs(minute * 60000).format('YYYY-MM-DD HH:mm');
};

export const getScheduleInMinute = (
  schedule: string,
  date: Date,
  time: Date
): number => {
  let minute;
  if (schedule === 'immediate') {
    minute = Math.floor(Date.now() / 60000);
  } else {
    const scheduledAt = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );
    minute = Math.floor(scheduledAt.getTime() / 60000);
  }
  return minute;
};

export const getRecurringFlag = (schedule: string): Recurring => {
  switch (schedule) {
    case 'daily':
      return 'daily';
    case 'weekly':
      return 'weekly';
    default:
      return 'none';
  }
};
