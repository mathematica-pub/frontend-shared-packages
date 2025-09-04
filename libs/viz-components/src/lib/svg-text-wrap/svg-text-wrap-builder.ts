import { safeAssign } from '@hsi/app-dev-kit';
import { SvgTextWrap } from './svg-text-wrap';

const DEFAULT = {
  _maintainXPosition: false,
  _maintainYPosition: false,
  _lineHeight: 1.1,
  _width: 100,
  _breakOnChars: [],
  _spaceAroundBreakChars: false,
};
export class SvgTextWrapBuilder {
  protected _width: number;
  protected _maintainXPosition: boolean;
  protected _maintainYPosition: boolean;
  protected _lineHeight: number;
  protected _breakOnChars: string[];
  protected _spaceAroundBreakChars: boolean;

  constructor() {
    safeAssign(this, DEFAULT);
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
   * OPTIONAL. Sets the characters to break on when wrapping text.
   * By default, text will only break on spaces.
   *
   * @default []
   */
  breakOnChars(breakOnChars: string[]) {
    this._breakOnChars = breakOnChars;
    return this;
  }

  /**
   * OPTIONAL. If true, spaces will be added around break characters.
   *
   * This is useful when breaking on punctuation characters, to avoid words being stuck to punctuation.
   * For example, breaking on commas without spaces around them would result in "word," at the end of one line and "word" at the start of the next line.
   *
   * @default false
   */
  spaceAroundBreakChars(spaceAroundBreakChars: boolean) {
    this._spaceAroundBreakChars = spaceAroundBreakChars;
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
      breakOnChars: this._breakOnChars,
      spaceAroundBreakChars: this._spaceAroundBreakChars,
    });
  }
}
