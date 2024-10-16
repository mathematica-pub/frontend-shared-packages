import { FillDef } from '../../../data-dimensions';
import { AreaFills } from './area-fills';

const DEFAULT = {
  _display: true,
  _opacity: 0.2,
};

export class AreaFillsBuilder<Datum> {
  private _color: (d: Datum) => string;
  private _display: boolean;
  private _fillDefs: FillDef<Datum>[];
  private _opacity: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. A string which determines color of the fill under line,
   * or a function whose input is the first point in the line and which returns
   * a color string.
   * This string is directly passed to `fill` under the hood.
   *
   * If not set, the color of the line will be used.
   */

  color(color: string | ((d: Datum) => string)): this {
    this._color = typeof color === 'string' ? () => color : color;
    return this;
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
   * OPTIONAL. A string to determine the gradient of the fill under line.
   *
   * @default undefined
   */
  fillDefs(fillDefs: FillDef<Datum>[]): this {
    this._fillDefs = fillDefs;
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
   * @internal This function is for internal use only and should never be called by the user.
   */
  _build(): AreaFills<Datum> {
    return {
      color: this._color,
      display: this._display,
      fillDefs: this._fillDefs,
      opacity: this._opacity,
    };
  }
}
