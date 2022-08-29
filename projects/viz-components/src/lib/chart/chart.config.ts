/**
 * QUESTION: is this width/height the same as a Dimensions object?
 * if so
 */
export class ChartConfig {
  width: number;
  height: number;
  scaleChartWithContainer: boolean;
  hasHoverEvents: boolean;
  constructor(init?: Partial<ChartConfig>) {
    Object.assign(this, init);
  }
}
