import { FillDefinition } from '../../../data-dimensions';
import { AreaFills } from './area-fills';

const DEFAULT = {
  _display: () => true,
  _opacity: 0.2,
  _gradient: undefined,
  _color: undefined,
};

export class AreaFillsBuilder<Datum> {
  private _display: (category: string) => boolean;
  private _opacity: number;
  private _customFills: FillDefinition<Datum>[];
  private _color: (d: Datum) => string;

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
   *
   * To unset the color, call with `null`.
   */
  color(color: null): this;
  color(color: string): this;
  color(color: (d: Datum) => string): this;
  color(color: string | ((d: Datum) => string) | null): this {
    if (color === null) {
      this._color = undefined;
      return this;
    }
    this._color = typeof color === 'string' ? () => color : color;
    return this;
  }

  /**
   * OPTIONAL. A boolean to determine if fill under line should be displayed.
   *
   * @default true
   */
  display(display: boolean): this;
  display(display: (category: string) => boolean): this;
  display(display: boolean | ((category: string) => boolean)): this {
    this._display = typeof display === 'boolean' ? () => display : display;
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
  customFills(customFills: FillDefinition<Datum>[]): this {
    this._customFills = customFills;
    return this;
  }

  /**
   * @internal This function is for internal use only and should never be called by the user.
   */
  _build(): AreaFills<Datum> {
    return {
      display: this._display,
      opacity: this._opacity,
      customFills: this._customFills,
      color: this._color,
    };
  }
}
