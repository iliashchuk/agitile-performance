import {
  drawPerformanceChart,
  fetchSprintInPathPerformance,
  renderSprintDetails,
} from './logic';

declare global {
  interface Window {
    renderPerformance(containerId: string): void;
  }
}

window.renderPerformance = () => {
  const container = document.getElementById('Performance-container');

  if (!container) {
    return null;
  }

  container.style = 'padding: 16px;';

  const canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const fetchAndDrawPerformanceChart = async () => {
    const sprintPerformance = await fetchSprintInPathPerformance();
    if (sprintPerformance) {
      renderSprintDetails(container, sprintPerformance);
      drawPerformanceChart(ctx, sprintPerformance);
    }
  };

  fetchAndDrawPerformanceChart();

  window.addEventListener('on-sprint-page', fetchAndDrawPerformanceChart);
};

if (!document.getElementById('Performance-container')) {
  window.renderPerformance('performance');
}
