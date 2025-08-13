import { safeAssign } from '@hsi/app-dev-kit';
import { ScaleTime, scaleUtc } from 'd3';
import { DataDimensionBuilder } from '../../dimension-builder';
import { DateChartPositionDimension } from './date-chart-position';

const DEFAULT = {
  _scaleFn: scaleUtc,
  _formatSpecifier: '%Y %m',
};

export class DateChartPositionDimensionBuilder<
  Datum,
> extends DataDimensionBuilder<Datum, Date> {
  private _domain: [Date, Date];
  private _formatSpecifier: string;
  private _scaleFn: (
    domain?: Iterable<Date>,
    range?: Iterable<number>
  ) => ScaleTime<number, number>;

  constructor() {
    super();
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Specifies the domain of the dimension.
   *
   * If not provided, the domain will be determined by the data.
   *
   * @param domain A two-item array of `Date` values specifying the minimum and maximum values of the domain.
   */
  domain(domain: null): this;
  domain(domain: [Date, Date]): this;
  domain(domain: [Date, Date]): this {
    if (domain === null) {
      this._domain = undefined;
      return this;
    }
    this._domain = domain;
    return this;
  }

  /**
   * OPTIONAL. Sets a format specifier that will be applied to values from this dimension for display purposes, for example, in a tooltip.
   *
   * This is a string that is passed to D3's utcFormat function.
   *
   * @param formatSpecifier A D3 date format string (e.g., "%m/%d/%Y").
   *
   * @default '%Y %m'
   */
  formatSpecifier(formatSpecifier: null): this;
  formatSpecifier(formatSpecifier: string): this;
  formatSpecifier(formatSpecifier: string): this {
    if (formatSpecifier === null) {
      this._formatSpecifier = undefined;
      return this;
    }
    this._formatSpecifier = formatSpecifier;
    return this;
  }

  /**
   * OPTIONAL. Maps values from the dimension's domain to the dimension's range.
   *
   * If the user provides a custom scale function through the `scale` method, this will be ignored.
   *
   * @param scaleFn A D3 scale function.
   *
   * @default d3.scaleUtc
   */
  scaleFn(scaleFn: null): this;
  scaleFn(
    scaleFn: (
      domain?: Iterable<Date>,
      range?: Iterable<number>
    ) => ScaleTime<number, number>
  ): this;
  scaleFn(
    scaleFn: (
      domain?: Iterable<Date>,
      range?: Iterable<number>
    ) => ScaleTime<number, number>
  ): this {
    if (scaleFn === null) {
      this._scaleFn = undefined;
      return this;
    }
    this._scaleFn = scaleFn;
    return this;
  }

  /**
   * @internal This function is for internal use only and should never be called by the user.
   *
   * @param dimensionName A user-intelligible name for the dimension being built. Used for error messages. Should be title cased.
   */
  _build(dimensionName: string): DateChartPositionDimension<Datum> {
    this.validateBuilder(dimensionName);
    return new DateChartPositionDimension<Datum>({
      domain: this._domain,
      formatFunction: this._formatFunction,
      formatSpecifier: this._formatSpecifier,
      scaleFn: this._scaleFn,
      valueAccessor: this._valueAccessor,
    });
  }

  private validateBuilder(dimensionName): void {
    this.validateValueAccessor(dimensionName);
  }
}
