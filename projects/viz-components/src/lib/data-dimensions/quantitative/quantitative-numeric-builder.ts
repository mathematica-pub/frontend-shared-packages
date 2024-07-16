import { Injectable } from '@angular/core';
import { ScaleContinuousNumeric, scaleLinear } from 'd3';
import { DataDimensionBuilder } from '../dimension-builder';
import { VicDomainPaddingConfig } from './domain-padding/domain-padding';
import { VicDimensionQuantitativeNumeric } from './quantitative-numeric';
import { VicDimensionQuantitativeNumericOptions } from './quantitative-numeric-options';

const DEFAULT: Partial<VicDimensionQuantitativeNumericOptions<unknown>> = {
  includeZeroInDomain: true,
  scaleFn: scaleLinear,
};

@Injectable({ providedIn: 'root' })
export class QuantitativeNumericBuilder<Datum> extends DataDimensionBuilder<
  Datum,
  number
> {
  private _domain: [number, number];
  private _formatSpecifier: string;
  private _includeZeroInDomain: boolean;
  private _domainPadding: VicDomainPaddingConfig;
  private _scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * Sets the domain of the scale.
   *
   * If not provided, the domain will be determined by the data.
   */
  domain(domain: [number, number]): this {
    this._domain = domain;
    return this;
  }

  /**
   * Sets a format specifier that will be applied to the value of this dimension for display purposes.
   */
  formatSpecifier(formatSpecifier: string): this {
    this._formatSpecifier = formatSpecifier;
    return this;
  }

  /**
   * Sets a boolean that indicates whether the domain of the dimension's scale should include zero.
   */
  includeZeroInDomain(includeZeroInDomain: boolean): this {
    this._includeZeroInDomain = includeZeroInDomain;
    return this;
  }

  /**
   * Sets the padding of the domain of the dimension's scale.
   */
  domainPadding(domainPadding: VicDomainPaddingConfig): this {
    this._domainPadding = domainPadding;
    return this;
  }

  /**
   * Sets the scale function for the dimension. This is a D3 scale function that maps values from the dimension's domain to the dimension's range.
   */
  scaleFn(
    scaleFn: (
      domain?: Iterable<number>,
      range?: Iterable<number>
    ) => ScaleContinuousNumeric<number, number>
  ): this {
    this._scaleFn = scaleFn;
    return this;
  }

  build(): VicDimensionQuantitativeNumeric<Datum> {
    return new VicDimensionQuantitativeNumeric({
      domain: this._domain,
      formatFunction: this._formatFunction,
      formatSpecifier: this._formatSpecifier,
      includeZeroInDomain: this._includeZeroInDomain,
      domainPadding: this._domainPadding,
      scaleFn: this._scaleFn,
      valueAccessor: this._valueAccessor,
    });
  }
}
