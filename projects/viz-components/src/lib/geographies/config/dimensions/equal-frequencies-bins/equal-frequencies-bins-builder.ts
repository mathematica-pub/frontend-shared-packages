import { Injectable } from '@angular/core';
import { interpolateLab, scaleQuantile } from 'd3';
import { CalculatedBinsBuilder } from '../calculated-bins/calculated-bins-builder';
import { VicEqualFrequenciesAttributeDataDimension } from './equal-frequencies-bins';

const DEFAULT = {
  _interpolator: interpolateLab,
  _nullColor: 'whitesmoke',
  _numBins: 4,
  _range: ['white', 'blue'],
  _scale: scaleQuantile,
};

@Injectable({ providedIn: 'root' })
export class VicEqualFrequenciesBinsBuilder<
  Datum,
  RangeValue extends string | number = string
> extends CalculatedBinsBuilder<Datum, RangeValue> {
  private _numBins: number;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * The number of bins to create.
   */
  numBins(numBins: number): this {
    this._numBins = numBins;
    return this;
  }

  build(): VicEqualFrequenciesAttributeDataDimension<Datum, RangeValue> {
    return new VicEqualFrequenciesAttributeDataDimension({
      interpolator: this._interpolator,
      nullColor: this._nullColor,
      numBins: this._numBins,
      range: this._range,
      scale: this._scale,
      valueAccessor: this._valueAccessor,
    });
  }
}
