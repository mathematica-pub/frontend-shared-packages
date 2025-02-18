import { ScaleContinuousNumeric, scaleLinear } from 'd3';
import { DataDimensionBuilder } from '../../dimension-builder';
import { ConcreteDomainPadding } from './domain-padding/concrete-domain-padding';
import { PercentOverDomainPadding } from './domain-padding/percent-over/percent-over';
import { PixelDomainPadding } from './domain-padding/pixel/pixel';
import { RoundUpToIntervalDomainPadding } from './domain-padding/round-to-interval/round-to-interval';
import { RoundUpToSigFigDomainPadding } from './domain-padding/round-to-sig-fig/round-to-sig-fig';
import { NumberChartPositionDimension } from './number-chart-position';

const DEFAULT = {
  _includeZeroInDomain: true,
  _scaleFn: scaleLinear,
};

const DEFAULT_PADDING = {
  pixels: 40,
  percentOver: 0.1,
  roundInterval: () => 1,
  roundUp: () => 1,
};

export class NumberChartPositionDimensionBuilder<
  Datum,
> extends DataDimensionBuilder<Datum, number> {
  private _domain: [number, number];
  private _formatSpecifier: string;
  private _includeZeroInDomain: boolean;
  private _domainPadding: ConcreteDomainPadding;
  private _scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Sets the domain of the scale.
   *
   * Should be in the form of [min, max].
   *
   * If not provided, the domain will be determined by the data.
   */
  domain(domain: null): this;
  domain(domain: [number, number]): this;
  domain(domain: [number, number]): this {
    if (domain === null) {
      this._domain = undefined;
      return this;
    }
    this._domain = domain;
    return this;
  }

  /**
   * OPTIONAL. Sets a format specifier that will be applied to the value of this dimension for display purposes.
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
   * OPTIONAL. Sets a boolean that indicates whether the domain of the dimension's scale should include zero.
   *
   * @default true
   */
  includeZeroInDomain(includeZeroInDomain: boolean): this {
    this._includeZeroInDomain = includeZeroInDomain;
    return this;
  }

  /**
   * OPTIONAL. Adds additional space between data values and the edge of a chart by increasing the max value of the quantitative domain.
   *
   * For example, if the domain is [0, 100] and the percent is 0.1, the new domain will be [0, 110].
   *
   * @default 0.1
   */
  domainPaddingPercentOver(
    percentOver: number = DEFAULT_PADDING.percentOver
  ): this {
    this._domainPadding = new PercentOverDomainPadding({
      percentOver,
    });
    return this;
  }

  /**
   * OPTIONAL. Adds additional space between data values and the edge of a chart by increasing the max value of the quantitative domain so that it exceeds its original value by the specified number of pixels.
   *
   * @default 40
   */
  domainPaddingPixels(numPixels: number = DEFAULT_PADDING.pixels): this {
    this._domainPadding = new PixelDomainPadding({ numPixels });
    return this;
  }

  /**
   * OPTIONAL. Adds additional space between data values and the edge of a chart by increasing the max value to a number that is rounded up to the specified interval.
   *
   * @default () => 1
   */
  domainPaddingRoundUpToInterval(
    interval: (d: number) => number = DEFAULT_PADDING.roundInterval
  ): this {
    this._domainPadding = new RoundUpToIntervalDomainPadding({
      interval,
    });
    return this;
  }

  /**
   * OPTIONAL. Adds additional space between data values and the edge of a chart by increasing the max value to a number that is rounded up to the specified number of significant figures.
   *
   * @default () => 1
   */
  domainPaddingRoundUpToSigFig(
    sigFigures: (d: number) => number = DEFAULT_PADDING.roundUp
  ): this {
    this._domainPadding = new RoundUpToSigFigDomainPadding({
      sigFigures,
    });
    return this;
  }

  /**
   * OPTIONAL. This is a D3 scale function that maps values from the dimension's domain to the dimension's range.
   *
   * @default d3.scaleLinear
   */
  scaleFn(scaleFn: null): this;
  scaleFn(
    scaleFn: (
      domain?: Iterable<number>,
      range?: Iterable<number>
    ) => ScaleContinuousNumeric<number, number>
  ): this;
  scaleFn(
    scaleFn: (
      domain?: Iterable<number>,
      range?: Iterable<number>
    ) => ScaleContinuousNumeric<number, number>
  ): this {
    if (scaleFn === null) {
      this._scaleFn = undefined;
      return this;
    }
    this._scaleFn = scaleFn;
    return this;
  }

  /**
   * @internal This method is not intended to be used by consumers of this library.
   *
   * @param dimensionName A user-intelligible name for the dimension being built. Used for error messages. Should be title cased.
   */
  _build(dimensionName: string): NumberChartPositionDimension<Datum> {
    this.validateBuilder(dimensionName);
    return new NumberChartPositionDimension({
      domain: this._domain,
      formatFunction: this._formatFunction,
      formatSpecifier: this._formatSpecifier,
      includeZeroInDomain: this._includeZeroInDomain,
      domainPadding: this._domainPadding,
      scaleFn: this._scaleFn,
      valueAccessor: this._valueAccessor,
    });
  }

  private validateBuilder(dimensionName: string): void {
    this.validateValueAccessor(dimensionName);
  }
}
