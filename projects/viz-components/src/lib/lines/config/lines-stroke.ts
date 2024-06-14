const DEFAULT = {
  linecap: 'round',
  linejoin: 'round',
  opacity: 1,
  width: 2,
};

export interface VicLinesStrokeOptions {
  /**
   * A value for the line's [stroke-linecap]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap}
   *  attribute.
   *
   * Default is 'round'.
   */
  linecap: string;

  /**
   * A value for the line's [stroke-linejoin]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin}
   *  attribute.
   *
   * Default is 'round'.
   */
  linejoin: string;

  /**
   * A value for the line's [stroke-opacity]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-opacity}
   *  attribute.
   *
   * Default is 1.
   */
  opacity: number;

  /**
   * A value for the line's [stroke-width]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width}
   *  attribute.
   *
   * Default is 2.
   */
  width: number;
}
export class VicLinesStroke implements VicLinesStrokeOptions {
  linecap: string;
  linejoin: string;
  opacity: number;
  width: number;

  constructor(options?: Partial<VicLinesStrokeOptions>) {
    Object.assign(this, DEFAULT, options);
  }
}
