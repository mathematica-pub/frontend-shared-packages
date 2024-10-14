import { DataValue } from '../../../core/types/values';
import { DataDimensionBuilder } from '../../dimension-builder';
import { CategoricalChartPositionDimension } from './categorical-chart-position';

const DEFAULT = {
  _align: 0.5,
  _paddingInner: 0.1,
  _paddingOuter: 0.1,
  _valueAccessor: (d, i) => i,
};

export class OrdinalDimensionBuilder<
  Datum,
  TOrdinalValue extends DataValue,
> extends DataDimensionBuilder<Datum, TOrdinalValue> {
  private _align: number;
  private _domain: TOrdinalValue[];
  private _paddingInner: number;
  private _paddingOuter: number;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Sets the alignment of the ordinal scale and is provided to [D3's align method](https://d3js.org/d3-scale/band#band_align)
   *
   * The value must be between 0 and 1.
   *
   * @default 0.5.
   */
  align(align: number): this {
    this._align = align;
    return this;
  }

  /**
   * OPTIONAL. Sets an array of ordinal values that will be used to define the domain of the scale.
   *
   * If not provided, the domain will be determined by the data.
   */
  domain(domain: TOrdinalValue[]): this {
    this._domain = domain;
    return this;
  }

  /**
   * OPTIONAL. Sets the inner padding of the ordinal scale and is provided to [D3's paddingInner method](https://d3js.org/d3-scale/band#band_paddingInner)
   *
   * The value must be between 0 and 1.
   *
   * @default 0.1.
   */
  paddingInner(paddingInner: number): this {
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
  paddingOuter(paddingOuter: number): this {
    this._paddingOuter = paddingOuter;
    return this;
  }

  /**
   * @internal This method is not intended to be used by consumers of this library.
   */
  _build(): CategoricalChartPositionDimension<Datum, TOrdinalValue> {
    return new CategoricalChartPositionDimension({
      align: this._align,
      domain: this._domain,
      formatFunction: this._formatFunction,
      paddingInner: this._paddingInner,
      paddingOuter: this._paddingOuter,
      valueAccessor: this._valueAccessor,
    });
  }
}
