/**
 * QUESTION: is this width/height the same as a Dimensions object?
 * if so
 */
export class ChartConfig {
  width: number;
  height: number;
  scaleChartWithContainer: boolean;
  hasHoverEvents: boolean;
}

/**
 * QUESTION: inclusive or exclusive of chart margins?
 */
export class Dimensions {
  width: number;
  height: number;
}

/**
 * QUESTION: what is ranges? is that the min and max values for x and y?
 * or pixels?
 */
export interface Ranges {
  x: [number, number];
  y: [number, number];
}
