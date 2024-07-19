import { interpolateLab, scaleLinear } from 'd3';
import { AttributeDataDimensionBuilder } from '../attribute-data/attribute-data-dimension-builder';
import { VicNoBinsAttributeDataDimension } from './no-bins';

const DEFAULT = {
  _interpolator: interpolateLab,
  _nullColor: 'whitesmoke',
  _range: ['white', 'slategray'],
  _scale: scaleLinear,
};

/**
 * Configuration object for attribute data that is quantitative and does not have bins.
 *
 * The generic parameter is the type of the attribute data.
 */
export class VicNoBinsBuilder<Datum> extends AttributeDataDimensionBuilder<
  Datum,
  number
> {
  private _domain: [number, number];
  private _formatSpecifier: string;

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
   * A format specifier that will be applied to the value of this dimension for display purposes.
   */
  formatSpecifier(formatSpecifier: string): this {
    this._formatSpecifier = formatSpecifier;
    return this;
  }

  build(): VicNoBinsAttributeDataDimension<Datum> {
    return new VicNoBinsAttributeDataDimension({
      domain: this._domain,
      fillPatterns: this._fillPatterns,
      formatFunction: this._formatFunction,
      formatSpecifier: this._formatSpecifier,
      interpolator: this._interpolator,
      nullColor: this._nullColor,
      range: this._range,
      scale: this._scale,
      valueAccessor: this._valueAccessor,
    });
  }
}
