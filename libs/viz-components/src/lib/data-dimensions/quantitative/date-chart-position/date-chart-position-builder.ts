import { ScaleTime, scaleUtc } from 'd3';
import { DataDimensionBuilder } from '../../dimension-builder';
import { DateChartPositionDimension } from './date-chart-position';

const DEFAULT = {
  _scaleFn: scaleUtc,
  formatSpecifier: '%Y %m',
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
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Sets the domain of the scale.
   *
   * If not provided, the domain will be determined by the data.
   */
  domain(domain: [Date, Date]): this {
    this._domain = domain;
    return this;
  }

  /**
   * OPTIONAL. Sets a format specifier that will be applied to values from this dimension for display purposes, for example, in a tooltip.
   *
   * This is a string that is passed to D3's timeFormat function.
   *
   * @default '%Y %m'
   */
  formatSpecifier(formatSpecifier: string): this {
    this._formatSpecifier = formatSpecifier;
    return this;
  }

  /**
   * OPTIONAL. This is a D3 scale function that maps values from the dimension's domain to the dimension's range.
   *
   * @default d3.scaleUtc
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
