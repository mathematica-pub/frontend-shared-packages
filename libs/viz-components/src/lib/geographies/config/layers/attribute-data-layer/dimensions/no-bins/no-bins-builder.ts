import { safeAssign } from '@mathstack/app-kit';
import { interpolateLab, scaleLinear } from 'd3';
import { AttributeDataDimensionBuilder } from '../attribute-data/attribute-data-dimension-builder';
import { NoBinsAttributeDataDimension } from './no-bins';

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
export class NoBinsAttributeDataDimensionBuilder<
  Datum,
> extends AttributeDataDimensionBuilder<Datum, number> {
  private _domain: [number, number];
  private _formatSpecifier: string;

  constructor() {
    super();
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. The domain of the scale. If not set, the domain will be inferred from the data.
   */
  domain(domain: [number, number]): this {
    this._domain = domain;
    return this;
  }

  /**
   * OPTIONAL. Sets a format specifier that will be applied to the value of this dimension using D3 format for display purposes.
   *
   * For example, this will format data values shown in a tooltip
   */
  formatSpecifier(formatSpecifier: string): this {
    this._formatSpecifier = formatSpecifier;
    return this;
  }

  /**
   * @internal This method is not intended to be used by consumers of this library.
   */
  _build(): NoBinsAttributeDataDimension<Datum> {
    return new NoBinsAttributeDataDimension({
      domain: this._domain,
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
