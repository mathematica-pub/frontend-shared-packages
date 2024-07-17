import {
  VicDataValue,
  VicDimensionOrdinal,
} from 'projects/viz-components/src/public-api';
import { DataDimensionBuilder } from '../dimension-builder';

const DEFAULT = {
  _align: 0.5,
  _paddingInner: 0.1,
  _paddingOuter: 0.1,
  _valueAccessor: (d, i) => i,
};

export class OrdinalDimensionBuilder<
  Datum,
  TOrdinalValue extends VicDataValue
> extends DataDimensionBuilder<Datum, TOrdinalValue> {
  _align: number;
  _domain: TOrdinalValue[];
  _paddingInner: number;
  _paddingOuter: number;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * Sets the alignment of the ordinal scale.
   *
   * The value must be between 0 and 1.
   *
   * Default is 0.5.
   */
  align(align: number): this {
    this._align = align;
    return this;
  }

  /**
   * Sets an array of ordinal values that will be used to define the domain of the scale.
   *
   * If not provided, the domain will be determined by the data.
   */
  domain(domain: TOrdinalValue[]): this {
    this._domain = domain;
    return this;
  }

  /**
   * Sets the inner padding of the ordinal scale.
   *
   * The value must be between 0 and 1.
   *
   * Default is 0.1.
   */
  paddingInner(paddingInner: number): this {
    this._paddingInner = paddingInner;
    return this;
  }

  /**
   * Sets the outer padding of the ordinal scale.
   *
   * The value must be between 0 and 1.
   *
   * Default is 0.1.
   */
  paddingOuter(paddingOuter: number): this {
    this._paddingOuter = paddingOuter;
    return this;
  }

  build(): VicDimensionOrdinal<Datum, TOrdinalValue> {
    return new VicDimensionOrdinal({
      align: this._align,
      domain: this._domain,
      formatFunction: this._formatFunction,
      paddingInner: this._paddingInner,
      paddingOuter: this._paddingOuter,
      valueAccessor: this._valueAccessor,
    });
  }
}
