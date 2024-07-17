import { VicStroke } from './stroke';

const DEFAULT = {
  linecap: 'round',
  linejoin: 'round',
  opacity: 1,
  width: 2,
};

export class VicStrokeBuilder {
  private _linecap: string;
  private _linejoin: string;
  private _opacity: number;
  private _width: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * A value for the line's [stroke-linecap]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap}
   *  attribute.
   *
   * Default is 'round'.
   */
  linecap(linecap: string): this {
    this._linecap = linecap;
    return this;
  }

  /**
   * A value for the line's [stroke-linejoin]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin}
   *  attribute.
   *
   * Default is 'round'.
   */
  linejoin(linejoin: string): this {
    this._linejoin = linejoin;
    return this;
  }

  /**
   * A value for the line's [stroke-opacity]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-opacity}
   *  attribute.
   *
   * Default is 1.
   */
  opacity(opacity: number): this {
    this._opacity = opacity;
    return this;
  }

  /**
   * A value for the line's [stroke-width]{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width}
   *  attribute.
   *
   * Default is 2.
   */
  width(width: number): this {
    this._width = width;
    return this;
  }

  build(): VicStroke {
    return new VicStroke({
      linecap: this._linecap,
      linejoin: this._linejoin,
      opacity: this._opacity,
      width: this._width,
    });
  }
}
