import { Injectable } from '@angular/core';
import { VicDataValue } from '../../core/types/values';
import { CategoricalDimensionBuilder } from '../../data-dimensions/categorical/categorical-builder';
import { OrdinalDimensionBuilder } from '../../data-dimensions/ordinal/ordinal-builder';
import { QuantitativeNumericDimensionBuilder } from '../../data-dimensions/quantitative/quantitative-numeric-builder';
import { DataMarksBuilder } from '../../data-marks/config/data-marks-builder';
import { VicBarsConfig } from './bars-config';
import {
  HORIZONTAL_BARS_DIMENSIONS,
  VERTICAL_BARS_DIMENSIONS,
} from './bars-dimensions';
import { BarsLabelsBuilder } from './labels/bar-labels-builder';

const DEFAULT = {
  _orientation: 'horizontal',
};

@Injectable()
export class VicBarsBuilder<
  Datum,
  TOrdinalValue extends VicDataValue
> extends DataMarksBuilder<Datum> {
  protected _orientation: 'horizontal' | 'vertical';
  protected categoricalDimensionBuilder: CategoricalDimensionBuilder<Datum>;
  protected ordinalDimensionBuilder: OrdinalDimensionBuilder<
    Datum,
    TOrdinalValue
  >;
  protected quantitativeDimensionBuilder: QuantitativeNumericDimensionBuilder<Datum>;
  protected labelsBuilder: BarsLabelsBuilder<Datum>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  createCategoricalDimension(
    setProperties: (dimension: CategoricalDimensionBuilder<Datum>) => void
  ): this {
    this.categoricalDimensionBuilder = new CategoricalDimensionBuilder<Datum>();
    setProperties(this.categoricalDimensionBuilder);
    return this;
  }

  createOrdinalDimension(
    setProperties: (
      dimension: OrdinalDimensionBuilder<Datum, TOrdinalValue>
    ) => void
  ): this {
    this.ordinalDimensionBuilder = new OrdinalDimensionBuilder<
      Datum,
      TOrdinalValue
    >();
    setProperties(this.ordinalDimensionBuilder);
    return this;
  }

  orientation(orientation: 'horizontal' | 'vertical'): this {
    this._orientation = orientation;
    return this;
  }

  createQuantitativeDimension(
    setProperties: (
      dimension: QuantitativeNumericDimensionBuilder<Datum>
    ) => void
  ): this {
    this.quantitativeDimensionBuilder =
      new QuantitativeNumericDimensionBuilder<Datum>();
    setProperties(this.quantitativeDimensionBuilder);
    return this;
  }

  createLabels(
    setProperties: (dimension: BarsLabelsBuilder<Datum>) => void
  ): this {
    this.labelsBuilder = new BarsLabelsBuilder<Datum>();
    setProperties(this.labelsBuilder);
    return this;
  }

  build(): VicBarsConfig<Datum, TOrdinalValue> {
    const dimensions =
      this._orientation === 'horizontal'
        ? HORIZONTAL_BARS_DIMENSIONS
        : VERTICAL_BARS_DIMENSIONS;
    return new VicBarsConfig(dimensions, {
      categorical: this.categoricalDimensionBuilder.build(),
      data: this._data,
      labels: this.labelsBuilder ? this.labelsBuilder.build() : undefined,
      mixBlendMode: this._mixBlendMode,
      ordinal: this.ordinalDimensionBuilder.build(),
      quantitative: this.quantitativeDimensionBuilder.build(),
    });
  }
}
