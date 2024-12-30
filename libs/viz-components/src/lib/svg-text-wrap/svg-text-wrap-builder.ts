import { SvgTextWrap } from './svg-text-wrap';

const DEFAULT = {
  _maintainXPosition: false,
  _maintainYPosition: false,
  _lineHeight: 1.1,
  _width: 100,
};
export class SvgTextWrapBuilder {
  protected _width: number;
  protected _maintainXPosition: boolean;
  protected _maintainYPosition: boolean;
  protected _lineHeight: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Sets the width to wrap the text to.
   *
   * @default 100
   */
  width(width: number) {
    this._width = width;
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
  build(): SvgTextWrap {
    return new SvgTextWrap({
      width: this._width,
      maintainXPosition: this._maintainXPosition,
      maintainYPosition: this._maintainYPosition,
      lineHeight: this._lineHeight,
    });
  }
}
