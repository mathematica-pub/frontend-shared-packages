import { TickWrap } from './tick-wrap';

const DEFAULT = {
  _wrapWidth: 'bandwidth',
  _maintainXPosition: false,
  _maintainYPosition: false,
  _lineHeight: 1.1,
};

export class TickWrapBuilder {
  _wrapWidth:
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
   * OPTIONAL. Sets the width to wrap the text to. Can be a number, a function that takes the chart width and number of ticks, or 'bandwidth'.
   *
   * If 'bandwidth', the width will be the bandwidth of the scale.
   *
   * @default 'bandwidth'
   */
  wrapWidth(wrapWidth: 'bandwidth'): this;
  wrapWidth(wrapWidth: number): this;
  wrapWidth(
    wrapWidth: (chartWidth: number, numOfTicks: number) => number
  ): this;
  wrapWidth(
    wrapWidth:
      | 'bandwidth'
      | number
      | ((chartWidth: number, numOfTicks: number) => number)
  ) {
    this._wrapWidth = wrapWidth;
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
   * OPTIONAL. Sets the line height of the text.
   *
   * @default 1.1
   */
  lineHeight(lineHeight: number) {
    this._lineHeight = lineHeight;
    return this;
  }

  /**
   * @internal Not meant to be called by consumers of the library.
   */
  _build(): TickWrap {
    return new TickWrap({
      wrapWidth: this._wrapWidth,
      maintainXPosition: this._maintainXPosition,
      maintainYPosition: this._maintainYPosition,
      lineHeight: this._lineHeight,
    });
  }
}
