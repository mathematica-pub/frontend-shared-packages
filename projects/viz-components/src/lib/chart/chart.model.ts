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

/**
 * QUESTION: inclusive or exclusive of chart margins?
 */
export class Dimensions {
  width: number;
  height: number;
  constructor(init?: Partial<Dimensions>) {
    Object.assign(this, init);
  }
}

/**
 * QUESTION: what is ranges? is that the min and max values for x and y?
 * or pixels?
 */
export interface Ranges {
  x: [number, number];
  y: [number, number];
}

export class ElementSpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
  constructor(init?: Partial<ElementSpacing>) {
    Object.assign(this, init);
  }
}
