export class ChartConfig {
  width: number;
  height: number;
  scaleChartWithContainer: boolean;
  hasHoverEvents: boolean;
  constructor(init?: Partial<ChartConfig>) {
    Object.assign(this, init);
  }
}
