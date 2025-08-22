import { safeAssign } from '@hsi/app-dev-kit';
import { ScaleContinuousNumeric, scaleLinear } from 'd3';
import { VisualValue } from '../../../core';
import { DataDimensionBuilder } from '../../dimension-builder';
import { NumberVisualValueDimension } from './number-visual-value';

const DEFAULT = {
  _includeZeroInDomain: false,
  _scaleFn: scaleLinear,
};

export class NumberVisualValueDimensionBuilder<
  Datum,
  Range extends VisualValue,
> extends DataDimensionBuilder<Datum, number> {
  private _domain: [number, number];
  private _formatSpecifier: string;
  private _includeZeroInDomain: boolean;
  private _range: [Range, Range];
  private _scale: (value: number) => Range;
  private _scaleFn: (
    domain?: Iterable<number>,
    range?: Iterable<Range>
  ) => ScaleContinuousNumeric<Range, Range>;

  constructor() {
    super();
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Specifies the domain of the dimension.
   *
   * If not provided, the domain will be determined by the data.
   *
   * @param domain A two-item array of `number` values specifying the minimum and maximum values of the domain.
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
   * OPTIONAL. Sets a format specifier that will be applied to values from this dimension for display purposes, for example, in a tooltip.
   *
   * @param formatSpecifier A D3 format string (e.g., ".2f" for two decimal places or "%m/%d/%Y" for a date).
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
   * @param includeZeroInDomain A `boolean` indicating whether the domain should include zero.
   *
   * @default false
   */
  includeZeroInDomain(includeZeroInDomain: boolean): this {
    this._includeZeroInDomain = includeZeroInDomain;
    return this;
  }

  /**
   * OPTIONAL. Sets a range of visual values that will be the output from [D3's scaleLinear](https://d3js.org/d3-scale/linear#scaleLinear)
   *
   * If not provided, a scale must be provided.
   *
   * For example, this could be a range of colors or sizes.
   *
   * To have all marks use the same visual value, use an array with a single element.
   *
   * @param range A two-item array specifying the minimum and maximum values of the range.
   */
  range(range: null): this;
  range(range: [Range, Range]): this;
  range(range: [Range, Range]): this {
    if (range === null) {
      this._range = undefined;
      return this;
    }
    this._range = range;
    return this;
  }

  /**
   * OPTIONAL. Allows a user to set a completely custom scale that transforms the value returned by this dimension's `valueAccessor` into a visual value (`string` or `number`).
   *
   * If not provided, a range must be provided.
   *
   * If provided, this will override any values provided to `domain`, `range`, and `scaleFn`.
   *
   * @param scale A function mapping a `number` value to a visual value `number` or `string`.
   */
  scale(scale: null): this;
  scale(scale: (value: number) => Range): this;
  scale(scale: (value: number) => Range): this {
    if (scale === null) {
      this._scale = undefined;
      return this;
    }
    this._scale = scale;
    return this;
  }

  /**
   * OPTIONAL. Maps values from the dimension's domain to the dimension's range.
   *
   * If the user provides a custom scale function through the `scale` method, this will be ignored.
   *
   * @param scaleFn A D3 scale function.
   *
   * @default d3.scaleLinear
   */
  scaleFn(scaleFn: null): this;
  scaleFn(
    scaleFn: (
      domain?: Iterable<number>,
      range?: Iterable<Range>
    ) => ScaleContinuousNumeric<Range, Range>
  ): this;
  scaleFn(
    scaleFn: (
      domain?: Iterable<number>,
      range?: Iterable<Range>
    ) => ScaleContinuousNumeric<Range, Range>
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
  _build(dimensionName: string): NumberVisualValueDimension<Datum, Range> {
    this.validateBuilder(dimensionName);
    return new NumberVisualValueDimension({
      domain: this._domain,
      formatFunction: this._formatFunction,
      formatSpecifier: this._formatSpecifier,
      includeZeroInDomain: this._includeZeroInDomain,
      range: this._range,
      scaleFn: this._scaleFn,
      scale: this._scale,
      valueAccessor: this._valueAccessor,
    });
  }

  private validateBuilder(dimensionName: string): void {
    this.validateValueAccessor(dimensionName);
    if (!this._range && !this._scale) {
      throw new Error(
        `${dimensionName} Dimension: Either a range or a scale must be provided.`
      );
    }
  }
}
