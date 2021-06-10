import {
  Interval,
  eachDayOfInterval,
  isSameDay,
  eachWeekendOfInterval,
} from 'date-fns';

export const getIdealDataset = (sprintInterval: Interval, totalSp: number) => {
  const days = eachDayOfInterval(sprintInterval);
  const weekends = eachWeekendOfInterval(sprintInterval);
  const weekdaysNumber = days.length - 1 - weekends.length;

  const idealSPPerDay = totalSp / weekdaysNumber;

  let left = totalSp;
  return days.map((day: Date, index) => {
    if (index === 0) {
      return left;
    }
    if (!weekends.some((weekend: Date) => isSameDay(weekend, day))) {
      left -= idealSPPerDay;

      return left;
    }
    return left;
  });
};
