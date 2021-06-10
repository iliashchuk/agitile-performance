import querystring from 'querystring';

import { SprintPerformance } from '../domain';

export const fetchSprintInPathPerformance = async (): Promise<SprintPerformance | null> => {
  try {
    const path = location.pathname;

    const pathChunks = path.split('/').filter((chunk) => chunk);

    console.log(pathChunks);

    const owner = pathChunks[0];
    const repo = pathChunks[1];
    const _id = pathChunks[3];

    if (!owner || !repo || !_id) {
      return null;
    }

    const sprintPerformanceResponse = await fetch(
      `http://localhost:4000/sprint-performance?${querystring.stringify({
        owner,
        repo,
        _id,
      })}`
    );
    const sprintPerformance = await sprintPerformanceResponse.json();

    return {
      ...sprintPerformance,
      startDate: new Date(sprintPerformance.startDate),
      endDate: new Date(sprintPerformance.endDate),
    };
  } catch (e) {
    console.log(e);

    return null;
  }
};
