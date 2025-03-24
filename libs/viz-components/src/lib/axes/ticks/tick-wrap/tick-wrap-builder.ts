import { TickWrap } from './tick-wrap';

const DEFAULT = {
  _wrapWidth: 'bandwidth',
  _lineHeight: 1.1,
};

export class TickWrapBuilder {
  _width:
    | 'bandwidth'
    | number
    | ((chartWidth: number, numOfTicks: number) => number);
  _maintainXPosition: boolean;
  _maintainYPosition: boolean;
  _lineHeight: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Sets the line-height property of the tick labels. Adjusting the line-height can useful when wrapping labels, particularly on a y-axis.
   *
   * @param value - The line-height of the tick labels, as a multiplier of the font size. For example, 1.1 is 110% of the font size, 1.5 is 150% of the font size, etc.
   */
  lineHeight(value: number | null) {
    if (value === null) {
      this._lineHeight = undefined;
      return this;
    }
    this._lineHeight = value;
    return this;
  }

  /**
   * OPTIONAL. If true, the x position of the text will be maintained.
   *
   * This is useful, for example, for centering bar labels on a vertical bar chart.
   *
   * @default false
   */
  maintainXPosition(maintainXPosition: boolean) {
    this._maintainXPosition = maintainXPosition;
    return this;
  }

  /**
   * OPTIONAL. If true, the y position of the text will be maintained.
   *
   * This is useful, for example, for centering bar labels on a horizontal bar chart.
   *
   * @default false
   */
  maintainYPosition(maintainYPosition: boolean) {
    this._maintainYPosition = maintainYPosition;
    return this;
  }

  /**
   * OPTIONAL. Sets the width to wrap the text to. Can be a number, a function that takes the chart width and number of ticks, or 'bandwidth'.
   *
   * If 'bandwidth', the width will be the bandwidth of the scale.
   *
   * @default 'bandwidth'
   */
  width(width: 'bandwidth'): this;
  width(width: number): this;
  width(width: (chartWidth: number, numOfTicks: number) => number): this;
  width(width: null): this;
  width(
    width:
      | 'bandwidth'
      | number
      | ((chartWidth: number, numOfTicks: number) => number)
      | null
  ) {
    if (width === null) {
      this._width = undefined;
      return this;
    }
    this._width = width;
    return this;
  }

  /**
   * @internal Not meant to be called by consumers of the library.
   */
  _build(dimension: 'x' | 'y'): TickWrap {
    this.validate(dimension);
    return new TickWrap({
      width: this._width,
      maintainXPosition: this._maintainXPosition,
      maintainYPosition: this._maintainYPosition,
      lineHeight: this._lineHeight,
    });
  }

  private validate(dimension: 'x' | 'y'): void {
    this._maintainXPosition =
      this._maintainXPosition === undefined
        ? dimension === 'y'
          ? true
          : false
        : this._maintainXPosition;
    this._maintainYPosition =
      this._maintainYPosition === undefined
        ? dimension === 'x'
          ? false
          : true
        : this._maintainYPosition;
  }
}
