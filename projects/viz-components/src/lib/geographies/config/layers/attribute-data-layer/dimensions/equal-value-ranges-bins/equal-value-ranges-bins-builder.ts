import { interpolateLab, scaleQuantize } from 'd3';
import { CalculatedBinsAttributeDataDimensionBuilder } from '../calculated-bins/calculated-bins-builder';
import { EqualValueRangesAttributeDataDimension } from './equal-value-ranges-bins';

const DEFAULT = {
  _interpolator: interpolateLab,
  _nullColor: 'whitesmoke',
  _numBins: 3,
  _range: ['white', 'pink', 'red'],
  _scale: scaleQuantize,
};

export class EqualValueRangesBinsBuilder<
  Datum,
  RangeValue extends string | number = string,
> extends CalculatedBinsAttributeDataDimensionBuilder<Datum, RangeValue> {
  private _domain: [number, number];
  private _numBins: number;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. The domain of the scale. If not set, the domain will be inferred from the data.
   */
  domain(domain: [number, number]): this {
    this._domain = domain;
    return this;
  }

  /**
   * OPTIONAL. The number of bins to create.
   *
   * @default 3
   */
  numBins(numBins: number): this {
    this._numBins = numBins;
    return this;
  }

  /**
   * @internal This method is not intended to be used by consumers of this library.
   */
  _build(): EqualValueRangesAttributeDataDimension<Datum, RangeValue> {
    return new EqualValueRangesAttributeDataDimension({
      domain: this._domain,
      fillPatterns: this._fillPatterns,
      formatFunction: this._formatFunction,
      formatSpecifier: this._formatSpecifier,
      interpolator: this._interpolator,
      nullColor: this._nullColor,
      numBins: this._numBins,
      range: this._range,
      scale: this._scale,
      valueAccessor: this._valueAccessor,
    });
  }
}
