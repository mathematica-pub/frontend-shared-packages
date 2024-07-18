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
    this.initCategoricalDimensionBuilder();
    setProperties(this.categoricalDimensionBuilder);
    return this;
  }

  private initCategoricalDimensionBuilder() {
    this.categoricalDimensionBuilder = new CategoricalDimensionBuilder();
  }

  createOrdinalDimension(
    setProperties: (
      dimension: OrdinalDimensionBuilder<Datum, TOrdinalValue>
    ) => void
  ): this {
    this.initOrdinalDimensionBuilder();
    if (setProperties) {
      setProperties(this.ordinalDimensionBuilder);
    }
    return this;
  }

  private initOrdinalDimensionBuilder() {
    this.ordinalDimensionBuilder = new OrdinalDimensionBuilder();
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
    this.initQuantitativeDimensionBuilder();
    if (setProperties) {
      setProperties(this.quantitativeDimensionBuilder);
    }
    return this;
  }

  private initQuantitativeDimensionBuilder() {
    this.quantitativeDimensionBuilder =
      new QuantitativeNumericDimensionBuilder();
  }

  createLabels(
    setProperties: (dimension: BarsLabelsBuilder<Datum>) => void
  ): this {
    this.labelsBuilder = new BarsLabelsBuilder<Datum>();
    if (setProperties) {
      setProperties(this.labelsBuilder);
    }
    return this;
  }

  build(): VicBarsConfig<Datum, TOrdinalValue> {
    const dimensions =
      this._orientation === 'horizontal'
        ? HORIZONTAL_BARS_DIMENSIONS
        : VERTICAL_BARS_DIMENSIONS;
    if (!this.categoricalDimensionBuilder) {
      this.initCategoricalDimensionBuilder();
    }
    if (!this.ordinalDimensionBuilder) {
      this.initOrdinalDimensionBuilder();
    }
    if (!this.quantitativeDimensionBuilder) {
      throw new Error(
        'Quantitative dimension is required. Please use method `createQuantitativeDimension` to create dimension.'
      );
    }
    return new VicBarsConfig(dimensions, {
      categorical: this.categoricalDimensionBuilder.build(),
      data: this._data,
      labels: this.labelsBuilder?.build(),
      mixBlendMode: this._mixBlendMode,
      ordinal: this.ordinalDimensionBuilder.build(),
      quantitative: this.quantitativeDimensionBuilder.build(),
    });
  }
}
