import Chart from 'chart.js';
import { ChartData } from 'chart.js';
import { format, parseISO } from 'date-fns';

import { SprintPerformance } from '../domain';
import { getIdealDataset } from './getIdealDataset';

export const drawPerformanceChart = (
  ctx: CanvasRenderingContext2D,
  { endDate, startDate, performanceByDay, totalStoryPoints }: SprintPerformance
) => {
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
          { start: startDate, end: endDate },
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
