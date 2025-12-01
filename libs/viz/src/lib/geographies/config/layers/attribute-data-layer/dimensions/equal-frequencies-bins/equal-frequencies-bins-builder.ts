import { safeAssign } from '@mathstack/app-kit';
import { interpolateLab, scaleQuantile } from 'd3';
import { CalculatedBinsAttributeDataDimensionBuilder } from '../calculated-bins/calculated-bins-builder';
import { EqualFrequenciesAttributeDataDimension } from './equal-frequencies-bins';

const DEFAULT = {
  _interpolator: interpolateLab,
  _nullColor: 'whitesmoke',
  _numBins: 4,
  _range: ['white', 'blue'],
  _scale: scaleQuantile,
};

export class EqualFrequenciesAttributeDataDimensionBuilder<
  Datum,
  RangeValue extends string | number = string,
> extends CalculatedBinsAttributeDataDimensionBuilder<Datum, RangeValue> {
  private _numBins: number;

  constructor() {
    super();
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. The number of bins to create.
   *
   * @default 4
   */
  numBins(numBins: number): this {
    this._numBins = numBins;
    return this;
  }

  /**
   * @internal This method is not intended to be used by consumers of this library.
   */
  _build(): EqualFrequenciesAttributeDataDimension<Datum, RangeValue> {
    return new EqualFrequenciesAttributeDataDimension({
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
