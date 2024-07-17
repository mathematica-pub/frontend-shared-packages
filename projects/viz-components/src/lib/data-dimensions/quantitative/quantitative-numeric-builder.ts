import { ScaleContinuousNumeric, scaleLinear } from 'd3';
import { DataDimensionBuilder } from '../dimension-builder';
import { VicDomainPaddingConfig } from './domain-padding/domain-padding';
import { VicPercentOverDomainPaddingBuilder } from './domain-padding/percent-over/percent-over-builder';
import { VicPixelDomainPaddingBuilder } from './domain-padding/pixel/pixel-builder';
import { VicRoundUpToIntervalDomainPaddingBuilder } from './domain-padding/round-to-interval/round-to-interval-builder';
import { VicRoundUpDomainPaddingBuilder } from './domain-padding/round-up/round-up-builder';
import { VicDimensionQuantitativeNumeric } from './quantitative-numeric';

const DEFAULT = {
  _includeZeroInDomain: true,
  _scaleFn: scaleLinear,
};

export class QuantitativeNumericDimensionBuilder<
  Datum
> extends DataDimensionBuilder<Datum, number> {
  private _domain: [number, number];
  private _formatSpecifier: string;
  private _includeZeroInDomain: boolean;
  private _domainPadding: VicDomainPaddingConfig;
  private _scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;
  private pixelDomainPaddingBuilder: VicPixelDomainPaddingBuilder;
  private percentOverDomainPaddingBuilder: VicPercentOverDomainPaddingBuilder;
  private roundUpDomainPaddingBuilder: VicRoundUpDomainPaddingBuilder;
  private roundUpToIntervalDomainPaddingBuilder: VicRoundUpToIntervalDomainPaddingBuilder;

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
  createPixelDomainPadding(
    setProperties?: (padding: VicPixelDomainPaddingBuilder) => void
  ): this {
    this.pixelDomainPaddingBuilder = new VicPixelDomainPaddingBuilder();
    if (setProperties) {
      setProperties(this.pixelDomainPaddingBuilder);
    }
    this._domainPadding = this.pixelDomainPaddingBuilder.build();
    return this;
  }

  /**
   * Sets the padding of the domain of the dimension's scale.
   */
  createPercentOverDomainPadding(
    setProperties?: (padding: VicPercentOverDomainPaddingBuilder) => void
  ): this {
    this.percentOverDomainPaddingBuilder =
      new VicPercentOverDomainPaddingBuilder();
    if (setProperties) {
      setProperties(this.percentOverDomainPaddingBuilder);
    }
    this._domainPadding = this.percentOverDomainPaddingBuilder.build();
    return this;
  }

  /**
   * Sets the padding of the domain of the dimension's scale.
   */
  createRoundUpDomainPadding(
    setProperties?: (padding: VicRoundUpDomainPaddingBuilder) => void
  ): this {
    this.roundUpDomainPaddingBuilder = new VicRoundUpDomainPaddingBuilder();
    if (setProperties) {
      setProperties(this.roundUpDomainPaddingBuilder);
    }
    this._domainPadding = this.roundUpDomainPaddingBuilder.build();
    return this;
  }

  /**
   * Sets the padding of the domain of the dimension's scale.
   */
  createRoundUpToIntervalDomainPadding(
    setProperties?: (padding: VicRoundUpToIntervalDomainPaddingBuilder) => void
  ): this {
    this.roundUpToIntervalDomainPaddingBuilder =
      new VicRoundUpToIntervalDomainPaddingBuilder();
    if (setProperties) {
      setProperties(this.roundUpToIntervalDomainPaddingBuilder);
    }
    this._domainPadding = this.roundUpToIntervalDomainPaddingBuilder.build();
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
