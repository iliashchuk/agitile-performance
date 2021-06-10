export interface SprintPerformance {
  startDate: Date;
  endDate: Date;
  name: string;
  totalStoryPoints: number;
  performanceByDay: Record<string, number>;
}
