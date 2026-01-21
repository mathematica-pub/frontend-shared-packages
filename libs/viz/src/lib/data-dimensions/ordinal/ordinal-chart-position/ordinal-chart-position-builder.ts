import { safeAssign } from '@mathstack/app-kit';
import { DataValue } from '../../../core/types/values';
import { DataDimensionBuilder } from '../../dimension-builder';
import { OrdinalChartPositionDimension } from './ordinal-chart-position';

const DEFAULT = {
  _align: 0.5,
  _paddingInner: 0.1,
  _paddingOuter: 0.1,
  _valueAccessor: (d, i) => i,
};

export class OrdinalChartPositionDimensionBuilder<
  Datum,
  Domain extends DataValue,
> extends DataDimensionBuilder<Datum, Domain> {
  private _align: number;
  private _domain: Domain[];
  private _paddingInner: number;
  private _paddingOuter: number;

  constructor() {
    super();
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Sets the alignment of the ordinal scale and is provided to [D3's align method](https://d3js.org/d3-scale/band#band_align)
   *
   * The value must be between 0 and 1.
   *
   * @default 0.5.
   */
  align(align: null): this;
  align(align: number): this;
  align(align: number): this {
    if (align === null) {
      this._align = DEFAULT._align;
      return this;
    }
    this._align = align;
    return this;
  }

  /**
   * OPTIONAL. Sets an array of ordinal values that will be used to define the domain of the scale.
   *
   * If not provided, the domain will be determined by the data.
   */
  domain(domain: null): this;
  domain(domain: Domain[]): this;
  domain(domain: Domain[]): this {
    if (domain === null) {
      this._domain = undefined;
      return this;
    }
    this._domain = domain;
    return this;
  }

  /**
   * OPTIONAL. Sets the inner padding of the ordinal scale and is provided to [D3's paddingInner method](https://d3js.org/d3-scale/band#band_paddingInner)
   *
   * Will have no effect if the scale is a point scale.
   *
   * The value must be between 0 and 1.
   *
   * @default 0.1.
   */
  paddingInner(paddingInner: null): this;
  paddingInner(paddingInner: number): this;
  paddingInner(paddingInner: number): this {
    if (paddingInner === null) {
      this._paddingInner = DEFAULT._paddingInner;
      return this;
    }
    this._paddingInner = paddingInner;
    return this;
  }

  /**
   * OPTIONAL. Sets the outer padding of the ordinal scale and is provided to [D3's paddingOuter method](https://d3js.org/d3-scale/band#band_paddingOuter)
   *
   * The value must be between 0 and 1.
   *
   * @default 0.1.
   */
  paddingOuter(paddingOuter: null): this;
  paddingOuter(paddingOuter: number): this;
  paddingOuter(paddingOuter: number): this {
    if (paddingOuter === null) {
      this._paddingOuter = DEFAULT._paddingOuter;
      return this;
    }
    this._paddingOuter = paddingOuter;
    return this;
  }

  /**
   * @internal This method is not intended to be used by consumers of this library.
   *
   * @param dimensionName A user-intelligible name for the dimension being built. Used for error messages. Should be title cased.
   */
  _build(
    scaleType: 'band' | 'point',
    dimensionName: string
  ): OrdinalChartPositionDimension<Datum, Domain> {
    this.validateDimension(dimensionName);
    return new OrdinalChartPositionDimension(scaleType, {
      align: this._align,
      domain: this._domain,
      formatFunction: this._formatFunction,
      paddingInner: this._paddingInner,
      paddingOuter: this._paddingOuter,
      valueAccessor: this._valueAccessor,
    });
  }

  private validateDimension(dimensionName: string): void {
    this.validateValueAccessor(dimensionName);
  }
}
