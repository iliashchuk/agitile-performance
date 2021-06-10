import { Chart, ChartData } from 'chart.js';
import {
  format,
  parseISO,
  Interval,
  eachDayOfInterval,
  isSameDay,
  eachWeekendOfInterval,
} from 'date-fns';
import querystring from 'querystring';

declare global {
  interface Window {
    renderPerformance(containerId: string): void;
  }
}

interface SprintPerformance {
  startDate: string;
  endDate: string;
  totalStoryPoints: number;
  performanceByDay: Record<string, number>;
}

window.renderPerformance = () => {
  const container = document.getElementById('Performance-container');

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

  const fetchSprintInPathPerformance = async () => {
    try {
      const path = location.pathname;

      const pathChunks = path.split('/').filter((chunk) => chunk);

      console.log(pathChunks);

      const owner = pathChunks[0];
      const repo = pathChunks[1];
      const _id = pathChunks[3];
      const sprintPerformance = await fetch(
        `http://localhost:4000/sprint-performance?${querystring.stringify({
          owner,
          repo,
          _id,
        })}`
      );
      return (await sprintPerformance.json()) as SprintPerformance;
    } catch (e) {
      console.log(e);
    }
  };

  const getIdealDataset = (sprintInterval: Interval, totalSp: number) => {
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

  const drawChart = ({
    endDate,
    startDate,
    performanceByDay,
    totalStoryPoints,
  }: SprintPerformance) => {
    const burndownData: ChartData = {
      labels: Object.keys(performanceByDay).map((dateStr) =>
        format(parseISO(dateStr), 'EEE d')
      ),
      datasets: [
        {
          lineTension: 0,
          borderColor: '#FC8181',
          fill: false,
          data: Object.values(performanceByDay).map(
            (completed) => totalStoryPoints - completed
          ),
        },
        {
          lineTension: 0,
          borderColor: '#63B3ED',
          fill: false,
          data: getIdealDataset(
            { start: new Date(startDate), end: new Date(endDate) },
            totalStoryPoints
          ),
        },
      ],
    };

    new Chart(ctx, {
      type: 'line',
      data: burndownData,
      options: {
        scales: { yAxes: [{ ticks: { min: 0, precision: 0 } }] },
        legend: {
          display: false,
        },
      },
    });
  };

  window.addEventListener('on-sprint-page', async () => {
    const sprintPerformance = await fetchSprintInPathPerformance();
    if (sprintPerformance) {
      drawChart(sprintPerformance);
    }
  });
};

if (!document.getElementById('Performance-container')) {
  window.renderPerformance('performance');
}
