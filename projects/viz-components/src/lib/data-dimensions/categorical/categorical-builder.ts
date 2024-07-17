import { schemeTableau10 } from 'd3';
import {
  VicDataValue,
  VicDimensionCategorical,
  VicFillPattern,
} from 'projects/viz-components/src/public-api';
import { DataDimensionBuilder } from '../dimension-builder';

const DEFAULT = {
  _range: schemeTableau10 as string[],
  _valueAccessor: () => '',
};

export class CategoricalDimensionBuilder<
  Datum,
  TCategoricalValue extends VicDataValue = string
> extends DataDimensionBuilder<Datum, TCategoricalValue> {
  private _domain: TCategoricalValue[];
  private _fillPatterns: VicFillPattern<Datum>[];
  private _range: string[];
  private _scale: (category: TCategoricalValue) => string;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * Sets an array of categorical values that will be used to define the domain of the scale.
   *
   * If not provided, the domain will be determined by the data.
   */
  domain(domain: TCategoricalValue[]): this {
    this._domain = domain;
    return this;
  }

  /**
   * Sets an array of fill patterns that will be used to fill the categorical values.
   */
  fillPatterns(fillPatterns: VicFillPattern<Datum>[]): this {
    this._fillPatterns = fillPatterns;
    return this;
  }

  /**
   * Sets an array of visual values that will be the output from D3 scale ordinal.
   *
   * For example, this could be an array of colors or sizes.
   *
   * Default is D3's schemeTableau10.
   *
   * To have all items have the same visual value, use an array with a single element.
   *
   * Will not be used if `scale` is provided.
   */
  range(range: string[]): this {
    this._range = range;
    return this;
  }

  /**
   * Sets a user-defined function that transforms a categorical value into a graphical value.
   * User must also provide their own implementation of `valueAccessor`.
   * If a custom valueAccessor function is not provided, this function will not be used (due to default value of `valueAccessor`).
   */
  scale(scale: (category: TCategoricalValue) => string): this {
    this._scale = scale;
    return this;
  }

  build(): VicDimensionCategorical<Datum, TCategoricalValue> {
    return new VicDimensionCategorical({
      domain: this._domain,
      fillPatterns: this._fillPatterns,
      formatFunction: this._formatFunction,
      range: this._range,
      scale: this._scale,
      valueAccessor: this._valueAccessor,
    });
  }
}
