import { Injectable } from '@angular/core';
import { scaleOrdinal } from 'd3';
import { AttributeDataDimensionBuilder } from '../attribute-data/attribute-data-dimension-builder';
import { VicCategoricalAttributeDataDimension } from './categorical-bins';

const DEFAULT = {
  _nullColor: 'whitesmoke',
  _range: ['white', 'lightslategray'],
  _scale: scaleOrdinal,
  _valueAccessor: () => '',
};

@Injectable({ providedIn: 'root' })
export class VicCategoricalBinsBuilder<
  Datum,
  RangeValue extends string | number = string
> extends AttributeDataDimensionBuilder<Datum, RangeValue> {
  private _domain: string[];

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  domain(domain: string[]): this {
    this._domain = domain;
    return this;
  }

  build(): VicCategoricalAttributeDataDimension<Datum, RangeValue> {
    return new VicCategoricalAttributeDataDimension({
      domain: this._domain,
      fillPatterns: this._fillPatterns,
      interpolator: this._interpolator,
      nullColor: this._nullColor,
      range: this._range,
      scale: this._scale,
    });
  }
}
