import { ScaleContinuousNumeric, scaleLinear } from 'd3';
import { DataDimensionBuilder } from '../../dimension-builder';
import { NumberNumberDimension } from '../number-number';

const DEFAULT = {
  _includeZeroInDomain: false,
  _scaleFn: scaleLinear,
};

export class NumberNumberDimensionBuilder<Datum> extends DataDimensionBuilder<
  Datum,
  number
> {
  private _domain: [number, number];
  private _formatSpecifier: string;
  private _includeZeroInDomain: boolean;
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
   * If not provided, the domain will be determined by the data.
   */
  domain(domain: [number, number]): this {
    this._domain = domain;
    return this;
  }

  /**
   * OPTIONAL. Sets a format specifier that will be applied to the value of this dimension for display purposes.
   */
  formatSpecifier(formatSpecifier: string): this {
    this._formatSpecifier = formatSpecifier;
    return this;
  }

  /**
   * OPTIONAL. Sets a boolean that indicates whether the domain of the dimension's scale should include zero.
   *
   * @default false
   */
  includeZeroInDomain(includeZeroInDomain: boolean): this {
    this._includeZeroInDomain = includeZeroInDomain;
    return this;
  }

  /**
   * OPTIONAL. This is a D3 scale function that maps values from the dimension's domain to the dimension's range.
   *
   * @default d3.scaleLinear
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

  /**
   * @internal This method is not intended to be used by consumers of this library.
   */
  _build(): NumberNumberDimension<Datum> {
    this.validateBuilder();
    return new NumberNumberDimension({
      domain: this._domain,
      formatFunction: this._formatFunction,
      formatSpecifier: this._formatSpecifier,
      includeZeroInDomain: this._includeZeroInDomain,
      scaleFn: this._scaleFn,
      valueAccessor: this._valueAccessor,
    });
  }

  private validateBuilder(): void {
    if (!this._valueAccessor) {
      throw new Error(
        'Number-Number Dimension: valueAccessor is required. Please use method `valueAccessor` to set it.'
      );
    }
  }
}
