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

  container.setAttribute('style', 'padding: 16px;');

  const canvas = document.createElement('canvas');
  canvas.setAttribute(
    'style',
    `
    max-width: 800px !important;
    max-height: 400px !important;
  `
  );
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

  // TODO: rewrite to handle adequately in standalone mode
  setTimeout(fetchAndDrawPerformanceChart, 2000);

  window.addEventListener('task-done', () => fetchAndDrawPerformanceChart);

  window.addEventListener('on-sprint-page', fetchAndDrawPerformanceChart);
};

if (!document.getElementById('Performance-container')) {
  window.renderPerformance('performance');
}
