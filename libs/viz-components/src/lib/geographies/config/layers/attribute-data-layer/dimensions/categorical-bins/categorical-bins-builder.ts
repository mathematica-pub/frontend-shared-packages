import { scaleOrdinal } from 'd3';
import { AttributeDataDimensionBuilder } from '../attribute-data/attribute-data-dimension-builder';
import { CategoricalBinsAttributeDataDimension } from './categorical-bins';

const DEFAULT = {
  _nullColor: 'whitesmoke',
  _range: ['white', 'lightslategray'],
  _scale: scaleOrdinal,
  _valueAccessor: () => '',
};

export class CategoricalBinsBuilder<
  Datum,
  RangeValue extends string | number = string,
> extends AttributeDataDimensionBuilder<Datum, RangeValue> {
  private _domain: string[];

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Sets the domain of the scale. If not set, the domain will be inferred from the data.
   */
  domain(domain: string[]): this {
    this._domain = domain;
    return this;
  }

  /**
   * @internal This method is not intended to be used by consumers of this library.
   */
  _build(): CategoricalBinsAttributeDataDimension<Datum, RangeValue> {
    return new CategoricalBinsAttributeDataDimension({
      domain: this._domain,
      formatFunction: this._formatFunction,
      interpolator: this._interpolator,
      nullColor: this._nullColor,
      range: this._range,
      scale: this._scale,
      valueAccessor: this._valueAccessor,
    });
  }
}
