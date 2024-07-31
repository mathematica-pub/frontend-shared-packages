import { schemeTableau10 } from 'd3';
import { DataValue } from '../../core/types/values';
import { DataDimensionBuilder } from '../dimension-builder';
import { CategoricalDimension } from './categorical';
import { FillPattern } from './fill-pattern';

const DEFAULT = {
  _range: schemeTableau10 as string[],
  _valueAccessor: () => '',
};

export class CategoricalDimensionBuilder<
  Datum,
  TCategoricalValue extends DataValue = string,
> extends DataDimensionBuilder<Datum, TCategoricalValue> {
  private _domain: TCategoricalValue[];
  private _fillPatterns: FillPattern<Datum>[];
  private _range: string[];
  private _scale: (category: TCategoricalValue) => string;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Sets an array of categorical values that will be used to define the domain of the scale.
   *
   * If not provided, the domain will be determined by the data.
   */
  domain(domain: TCategoricalValue[]): this {
    this._domain = domain;
    return this;
  }

  /**
   * OPTIONAL. Sets an array of fill patterns that will be used to fill the categorical values.
   */
  fillPatterns(fillPatterns: FillPattern<Datum>[]): this {
    this._fillPatterns = fillPatterns;
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
  range(range: string[]): this {
    this._range = range;
    return this;
  }

  /**
   * OPTIONAL. Sets a user-defined function that transforms a categorical value into a graphical value.
   *
   * User must also provide their own implementation of `valueAccessor`.
   *
   * If a custom valueAccessor function is not provided, this function will not be used (due to default value of `valueAccessor`).
   */
  scale(scale: (category: TCategoricalValue) => string): this {
    this._scale = scale;
    return this;
  }

  /**
   * @internal This method is not intended to be used by consumers of this library.
   */
  _build(): CategoricalDimension<Datum, TCategoricalValue> {
    return new CategoricalDimension({
      domain: this._domain,
      fillPatterns: this._fillPatterns,
      formatFunction: this._formatFunction,
      range: this._range,
      scale: this._scale,
      valueAccessor: this._valueAccessor,
    });
  }
}
