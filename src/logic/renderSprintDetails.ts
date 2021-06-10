import format from 'date-fns/format';
import { SprintPerformance } from '../domain';

const detailsContainerId = 'details';

export const renderSprintDetails = (
  container: HTMLElement,
  { endDate, startDate, totalStoryPoints, name }: SprintPerformance
) => {
  let detailsContainer = document.getElementById(detailsContainerId);

  if (!detailsContainer) {
    detailsContainer = document.createElement('div');
    detailsContainer.id = detailsContainerId;
    container.prepend(detailsContainer);
  }

  const formatDate = (date: Date) => format(date, 'MMMM d yyyy');

  detailsContainer.innerHTML = /*html*/ `
    <h1 style="font-size: 18px;"><b>${name}</b> performance.</h1>
    <br/>
    <div display="flex">
      <p>
        Sprint starts at <b>${formatDate(startDate)}</b>,
        and ends at <b>${formatDate(endDate)}</b>.
      </p>
      <p>Total task Story Points: <b>${totalStoryPoints}</b>.</p>
    </div>
    <br/>
  `;
};
