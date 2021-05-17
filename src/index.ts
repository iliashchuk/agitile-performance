import { Chart, ChartData, ChartOptions } from 'chart.js';
import {
  format,
  Interval,
  eachDayOfInterval,
  isSameDay,
  eachWeekendOfInterval,
} from 'date-fns';

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

renderBurndown('chart');

function renderBurndown(elementId: string) {
  const speedCanvas = document.getElementById(elementId) as HTMLCanvasElement;

  if (!speedCanvas) {
    return null;
  }

  const ctx = speedCanvas.getContext('2d');

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
        borderColor: 'firebrick',
        fill: false,
        data: Object.values(SP_COMPLETED).map(
          (completed) => TOTAL_SP - completed
        ),
      },
      {
        lineTension: 0,
        borderColor: 'blue',
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
}
