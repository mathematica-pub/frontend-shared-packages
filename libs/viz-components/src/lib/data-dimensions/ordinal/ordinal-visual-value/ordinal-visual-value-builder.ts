import { safeAssign } from '@hsi/app-dev-kit';
import { schemeTableau10 } from 'd3';
import { DataValue, VisualValue } from '../../../core/types/values';
import { DataDimensionBuilder } from '../../dimension-builder';
import { OrdinalVisualValueDimension } from './ordinal-visual-value';

const DEFAULT = {
  _range: schemeTableau10,
  _valueAccessor: () => '',
};

export class OrdinalVisualValueDimensionBuilder<
  Datum,
  Domain extends DataValue,
  Range extends VisualValue,
> extends DataDimensionBuilder<Datum, Domain> {
  private _domain: Domain[];
  private _range: Range[];
  private _scale: (category: Domain) => Range;

  constructor() {
    super();
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Determines the array of categorical values that is used as the domain of the scale.
   *
   * @param value - An array of categorical values, or `null` to unset the domain.
   *
   * If not provided, the domain will be determined by the data.
   */
  domain(value: Domain[] | null): this {
    if (value === null) {
      this._domain = undefined;
      return this;
    }
    this._domain = value;
    return this;
  }

  /**
   * OPTIONAL. Sets an array of visual values that will be the output from D3 scale ordinal.
   *
   * For example, this could be an array of colors or sizes.
   *
   * To have all marks use the same visual value, use an array with a single element.
   *
   * Will not be used if `scale` is set by the user.
   *
   * @default d3.schemeTableau10
   */
  range(range: null): this;
  range(range: Range[]): this;
  range(range: Range[]): this {
    if (range === null) {
      this._range = DEFAULT._range as Range[];
      return this;
    }
    this._range = range;
    return this;
  }

  /**
   * OPTIONAL. Sets a user-defined function that transforms a categorical value into a visual value.
   *
   * User must also provide their own implementation of `valueAccessor`.
   *
   * If a custom valueAccessor function is not provided, this function will not be used even if provided (due to default value of `valueAccessor`).
   */
  scale(scale: null): this;
  scale(scale: (category: Domain) => Range): this;
  scale(scale: (category: Domain) => Range): this {
    if (scale === null) {
      this._scale = undefined;
      return this;
    }
    this._scale = scale;
    return this;
  }

  /**
   * @internal This method is not intended to be used by consumers of this library.
   *
   * @param dimensionName A user-intelligible name for the dimension being built. Used for error messages. Should be title cased.
   */
  _build(
    dimensionName: string
  ): OrdinalVisualValueDimension<Datum, Domain, Range> {
    this.validateDimension(dimensionName);
    return new OrdinalVisualValueDimension({
      domain: this._domain,
      formatFunction: this._formatFunction,
      range: this._range,
      scale: this._scale,
      valueAccessor: this._valueAccessor,
    });
  }

  private validateDimension(dimensionName: string): void {
    this.validateValueAccessor(dimensionName);
    if (!this._range && !this._scale) {
      throw new Error(
        `${dimensionName} Dimension: Either a range or a scale must be provided.`
      );
    }
  }
}
