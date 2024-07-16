import { Injectable } from '@angular/core';
import { interpolateLab, scaleQuantize } from 'd3';
import { CalculatedBinsBuilder } from '../calculated-bins/calculated-bins-builder';
import { VicEqualValueRangesAttributeDataDimension } from './equal-value-ranges-bins';

const DEFAULT = {
  _interpolator: interpolateLab,
  _nullColor: 'whitesmoke',
  _numBins: 3,
  _range: ['white', 'pink', 'red'],
  _scale: scaleQuantize,
};

@Injectable({ providedIn: 'root' })
export class VicEqualValueRangesBinsBuilder<
  Datum,
  RangeValue extends string | number = string
> extends CalculatedBinsBuilder<Datum, RangeValue> {
  private _domain: [number, number];
  private _numBins: number;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * The domain of the scale.
   */
  domain(domain: [number, number]): this {
    this._domain = domain;
    return this;
  }

  /**
   * The number of bins to create.
   */
  numBins(numBins: number): this {
    this._numBins = numBins;
    return this;
  }

  build(): VicEqualValueRangesAttributeDataDimension<Datum, RangeValue> {
    return new VicEqualValueRangesAttributeDataDimension({
      domain: this._domain,
      interpolator: this._interpolator,
      nullColor: this._nullColor,
      numBins: this._numBins,
      range: this._range,
      scale: this._scale,
      valueAccessor: this._valueAccessor,
    });
  }
}
