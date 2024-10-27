import { LinesStroke } from './lines-stroke';

const DEFAULT = {
  _dasharray: 'none',
  _linecap: 'round',
  _linejoin: 'round',
  _opacity: 1,
  _width: 2,
};

export class LinesStrokeBuilder {
  private _dasharray: string;
  private _linecap: string;
  private _linejoin: string;
  private _opacity: number;
  private _width: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. A value for the line's [stroke-dasharray]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray}
   *  attribute.
   *
   * @default 'round'
   */
  dasharray(dasharray: string): this {
    this._dasharray = dasharray;
    return this;
  }

  /**
   * OPTIONAL. A value for the line's [stroke-linecap]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap}
   *  attribute.
   *
   * @default 'round'
   */
  linecap(linecap: string): this {
    this._linecap = linecap;
    return this;
  }

  /**
   * OPTIONAL. A value for the line's [stroke-linejoin]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin}
   *  attribute.
   *
   * @default 'round'
   */
  linejoin(linejoin: string): this {
    this._linejoin = linejoin;
    return this;
  }

  /**
   * OPTIONAL. A value for the line's [stroke-opacity]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-opacity}
   *  attribute.
   *
   * @default 1
   */
  opacity(opacity: number): this {
    this._opacity = opacity;
    return this;
  }

  /**
   * OPTIONAL. A value for the line's [stroke-width]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width}
   *  attribute, in px.
   *
   * @default 2
   */
  width(width: number): this {
    this._width = width;
    return this;
  }

  /**
   * @internal This function is for internal use only and should never be called by the user.
   */
  _build(): LinesStroke {
    return new LinesStroke({
      dasharray: this._dasharray,
      linecap: this._linecap,
      linejoin: this._linejoin,
      opacity: this._opacity,
      width: this._width,
    });
  }
}
