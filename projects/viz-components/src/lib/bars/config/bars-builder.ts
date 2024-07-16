import { Injectable } from '@angular/core';
import { VicDataValue } from '../../core/types/values';
import { VicDimensionCategorical } from '../../data-dimensions/categorical/categorical';
import { CategoricalDimensionBuilder } from '../../data-dimensions/categorical/categorical-builder';
import { VicDimensionOrdinal } from '../../data-dimensions/ordinal/ordinal';
import { OrdinalDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-builder';
import { VicDimensionQuantitativeNumeric } from '../../data-dimensions/quantitative/quantitative-numeric';
import { DataMarksBuilder } from '../../data-marks/config/data-marks-builder';
import { VicBarsConfig } from './bars-config';
import {
  HORIZONTAL_BARS_DIMENSIONS,
  VERTICAL_BARS_DIMENSIONS,
} from './bars-dimensions';
import { VicBarsLabels } from './labels/bars-labels';

@Injectable({ providedIn: 'root' })
export class BarsBuilder<
  Datum,
  TOrdinalValue extends VicDataValue
> extends DataMarksBuilder<Datum> {
  private _categorical: VicDimensionCategorical<Datum, string>;
  private _ordinal: VicDimensionOrdinal<Datum, TOrdinalValue>;
  private _quantitative: VicDimensionQuantitativeNumeric<Datum>;
  private _labels: VicBarsLabels<Datum>;

  constructor(
    public categoricalBuilder: CategoricalDimensionBuilder<Datum>,
    public ordinalBuilder: OrdinalDimensionBuilder<Datum, TOrdinalValue>
  ) {
    super();
  }

  categorical(categorical: VicDimensionCategorical<Datum, string>): this {
    this._categorical = categorical;
    return this;
  }

  ordinal(ordinal: VicDimensionOrdinal<Datum, TOrdinalValue>): this {
    this._ordinal = ordinal;
    return this;
  }

  quantitative(quantitative: VicDimensionQuantitativeNumeric<Datum>): this {
    this._quantitative = quantitative;
    return this;
  }

  labels(labels: VicBarsLabels<Datum>): this {
    this._labels = labels;
    return this;
  }

  build(
    direction: 'horizontal' | 'vertical'
  ): VicBarsConfig<Datum, TOrdinalValue> {
    const dimensions =
      direction === 'horizontal'
        ? HORIZONTAL_BARS_DIMENSIONS
        : VERTICAL_BARS_DIMENSIONS;
    return new VicBarsConfig(dimensions, {
      categorical: this._categorical,
      ordinal: this._ordinal,
      quantitative: this._quantitative,
      labels: this._labels,
    });
  }
}
