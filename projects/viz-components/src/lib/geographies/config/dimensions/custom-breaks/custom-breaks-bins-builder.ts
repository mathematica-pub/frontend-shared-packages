import { Injectable } from '@angular/core';
import { interpolateLab, scaleThreshold } from 'd3';
import { AttributeDataDimensionBuilder } from '../attribute-data/attribute-data-dimension-builder';
import { VicCustomBreaksAttributeDataDimension } from './custom-breaks-bins';

const DEFAULT = {
  _interpolator: interpolateLab,
  _nullColor: 'whitesmoke',
  _scale: scaleThreshold,
};

@Injectable({ providedIn: 'root' })
export class VicCustomBreaksBuilder<
  Datum,
  RangeValue extends string | number = string
> extends AttributeDataDimensionBuilder<Datum, number, RangeValue> {
  private _breakValues: number[];
  private _formatSpecifier: string;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * An array of values to specify bin ranges. This array should include both the lowest and highest values and must have at least two values.
   *
   * An array of [0, 2, 5, 10, 50] will create bins [0, 2], [2, 5], [5, 10], [10, 50].
   *
   * Values should be in ascending order.
   *
   * Values below the first value will be colored with the color for the first bin. Values above the last value will be colored with the color for the last bin. In this sense, the first and last values are primarily used for 
   in a legend, should one be displayed. In order for the legend to be accurate, users should ensure that the first and last values are the minimum and maximum values in the data.
   */
  breakValues(breakValues: number[]): this {
    this._breakValues = breakValues;
    return this;
  }

  /**
   * A format specifier that will be applied to the value of this dimension for display purposes.
   */
  formatSpecifier(formatSpecifier: string): this {
    this._formatSpecifier = formatSpecifier;
    return this;
  }

  build(): VicCustomBreaksAttributeDataDimension<Datum, RangeValue> {
    return new VicCustomBreaksAttributeDataDimension({
      breakValues: this._breakValues,
      formatSpecifier: this._formatSpecifier,
      interpolator: this._interpolator,
      nullColor: this._nullColor,
      range: this._range,
      scale: this._scale,
      valueAccessor: this._valueAccessor,
    });
  }
}
