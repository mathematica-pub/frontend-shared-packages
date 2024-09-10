import { FillDef } from '../../../data-dimensions';
import { BelowLineAreaFills } from './below-line-area-fills';

const DEFAULT = {
  _display: true,
  _opacity: 0.2,
  _gradient: undefined,
};

export class BelowLineAreaFillsBuilder<Datum> {
  private _display: boolean;
  private _opacity: number;
  private _fillDefs: FillDef<Datum>[];

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. A boolean to determine if fill under line should be displayed.
   *
   * @default true
   */
  display(display: boolean): this {
    this._display = display;
    return this;
  }

  /**
   * OPTIONAL. A number to determine the opacity of the fill under line.
   *
   * @default 0.2
   */
  opacity(opacity: number): this {
    this._opacity = opacity;
    return this;
  }

  /**
   * OPTIONAL. A string to determine the gradient of the fill under line.
   *
   * @default undefined
   */
  fillDefs(fillDefs: FillDef<Datum>[]): this {
    this._fillDefs = fillDefs;
    return this;
  }

  /**
   * @internal This function is for internal use only and should never be called by the user.
   */
  _build(): BelowLineAreaFills<Datum> {
    return {
      display: this._display,
      opacity: this._opacity,
      fillDefs: this._fillDefs,
    };
  }
}
