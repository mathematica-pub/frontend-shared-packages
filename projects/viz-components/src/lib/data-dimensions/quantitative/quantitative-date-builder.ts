import { Injectable } from '@angular/core';
import { ScaleTime, scaleUtc } from 'd3';
import { DataDimensionBuilder } from '../dimension-builder';
import { VicDimensionQuantitativeDate } from './quantitative-date';

const DEFAULT = {
  scaleFn: scaleUtc,
};

@Injectable({ providedIn: 'root' })
export class QuantitativeDateBuilder<Datum> extends DataDimensionBuilder<
  Datum,
  Date
> {
  private _domain: [Date, Date];
  private _formatSpecifier: string;
  private _scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * Sets the domain of the scale.
   *
   * If not provided, the domain will be determined by the data.
   */
  domain(domain: [Date, Date]): this {
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
   * Sets the scale function for the dimension. This is a D3 scale function that maps values from the dimension's domain to the dimension's range.
   */
  scaleFn(
    scaleFn: (
      domain?: Iterable<Date>,
      range?: Iterable<number>
    ) => ScaleTime<number, number>
  ): this {
    this._scaleFn = scaleFn;
    return this;
  }

  build(): VicDimensionQuantitativeDate<Datum> {
    return new VicDimensionQuantitativeDate<Datum>({
      domain: this._domain,
      formatFunction: this._formatFunction,
      formatSpecifier: this._formatSpecifier,
      scaleFn: this._scaleFn,
      valueAccessor: this._valueAccessor,
    });
  }
}
