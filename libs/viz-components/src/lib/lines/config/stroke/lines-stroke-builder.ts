import { safeAssign } from '@mathstack/app-kit';
import { OrdinalVisualValueDimensionBuilder } from '../../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value-builder';
import { LinesStroke } from './lines-stroke';

const DEFAULT = {
  _dasharray: 'none',
  _linecap: 'round',
  _linejoin: 'round',
  _opacity: 1,
  _width: 2,
};

export class LinesStrokeBuilder<Datum> {
  private colorDimensionBuilder: OrdinalVisualValueDimensionBuilder<
    Datum,
    string,
    string
  >;
  private _dasharray: string;
  private _linecap: string;
  private _linejoin: string;
  private _opacity: number;
  private _width: number;

  constructor() {
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Creates a dimension that will control the color of the bars.
   *
   * If not provided, all bars will be colored with the first color in `d3.schemeTableau10`, the default `range` for the dimension.
   */
  color(color: null): this;
  color(
    color: (
      dimension: OrdinalVisualValueDimensionBuilder<Datum, string, string>
    ) => void
  ): this;
  color(
    color:
      | ((
          dimension: OrdinalVisualValueDimensionBuilder<Datum, string, string>
        ) => void)
      | null
  ): this {
    if (color === null) {
      this.colorDimensionBuilder = undefined;
      return this;
    }
    this.initColorDimensionBuilder();
    color(this.colorDimensionBuilder);
    return this;
  }

  private initColorDimensionBuilder() {
    this.colorDimensionBuilder = new OrdinalVisualValueDimensionBuilder();
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
  _build(): LinesStroke<Datum> {
    this.validateBuilder();
    return new LinesStroke<Datum>({
      color: this.colorDimensionBuilder._build('Lines Stroke Color'),
      dasharray: this._dasharray,
      linecap: this._linecap,
      linejoin: this._linejoin,
      opacity: this._opacity,
      width: this._width,
    });
  }

  validateBuilder(): void {
    if (!this.colorDimensionBuilder) {
      this.initColorDimensionBuilder();
    }
  }
}
