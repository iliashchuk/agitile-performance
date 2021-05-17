import { Chart, ChartData } from 'chart.js';
import {
  format,
  Interval,
  eachDayOfInterval,
  isSameDay,
  eachWeekendOfInterval,
} from 'date-fns';

declare global {
  interface Window {
    renderPerformance(containerId: string): void;
  }
}

const START_DAY = new Date(2021, 5, 1);
const END = new Date(2021, 5, 14);
const TOTAL_SP = 22;

const SP_COMPLETED = {
  '2021/5/1': 0,
  '2021/5/2': 0,
  '2021/5/3': 3,
  '2021/5/4': 5,
  '2021/5/5': 5,
  '2021/5/6': 5,
  '2021/5/7': 7,
  '2021/5/8': 7,
  '2021/5/9': 15,
  '2021/5/10': 15,
  '2021/5/11': 15,
  '2021/5/12': 20,
  '2021/5/13': 20,
  '2021/5/14': 22,
};

const getIdealDataset = (sprintInterval: Interval, totalSp: number) => {
  const days = eachDayOfInterval(sprintInterval);
  const weekends = eachWeekendOfInterval(sprintInterval);
  const weekdaysNumber = days.length - 1 - weekends.length;

  const idealSPPerDay = totalSp / weekdaysNumber;

  let left = totalSp;
  return days.map((day, index) => {
    if (index === 0) {
      return left;
    }
    if (!weekends.some((weekend) => isSameDay(weekend, day))) {
      left -= idealSPPerDay;

      return left;
    }
    return left;
  });
};

window.renderPerformance = (containerId: string) => {
  const container = document.getElementById(containerId);

  if (!container) {
    return null;
  }
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const burndownData: ChartData = {
    labels: Object.keys(SP_COMPLETED).map((dateStr) =>
      format(new Date(dateStr), 'EEE d')
    ),
    datasets: [
      {
        lineTension: 0,
        borderColor: '#FC8181',
        fill: false,
        data: Object.values(SP_COMPLETED).map(
          (completed) => TOTAL_SP - completed
        ),
      },
      {
        lineTension: 0,
        borderColor: '#63B3ED',
        fill: false,
        data: getIdealDataset({ start: START_DAY, end: END }, TOTAL_SP),
      },
    ],
  };

  new Chart(ctx, {
    type: 'line',
    data: burndownData,
    options: {
      legend: {
        display: false,
      },
    },
  });
};

if (!document.getElementById('Performance-container')) {
  window.renderPerformance('performance');
}
