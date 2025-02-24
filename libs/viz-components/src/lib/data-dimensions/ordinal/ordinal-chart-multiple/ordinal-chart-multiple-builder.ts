import { DataValue } from '../../../core/types/values';
import { DataDimensionBuilder } from '../../dimension-builder';
import { OrdinalChartMultipleDimension } from './ordinal-chart-multiple';

const DEFAULT = {
  _valueAccessor: () => '',
};

export class OrdinalChartMultipleDimensionBuilder<
  Datum,
  Domain extends DataValue,
> extends DataDimensionBuilder<Datum, Domain> {
  private _domain: Domain[];

  constructor() {
    super();
    Object.assign(this, DEFAULT);
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
   * @internal This method is not intended to be used by consumers of this library.
   *
   * @param dimensionName A user-intelligible name for the dimension being built. Used for error messages. Should be title cased.
   */
  _build(): OrdinalChartMultipleDimension<Datum, Domain> {
    return new OrdinalChartMultipleDimension({
      domain: this._domain,
      formatFunction: this._formatFunction,
      valueAccessor: this._valueAccessor,
    });
  }
}
