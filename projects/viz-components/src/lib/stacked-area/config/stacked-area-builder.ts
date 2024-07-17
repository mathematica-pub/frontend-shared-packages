import { Injectable } from '@angular/core';
import {
  CurveFactory,
  curveLinear,
  InternMap,
  schemeTableau10,
  Series,
  stackOffsetNone,
  stackOrderNone,
} from 'd3';
import {
  VicContinuousValue,
  VicDataValue,
  VicStackedAreaConfig,
} from 'projects/viz-components/src/public-api';
import { CategoricalDimensionBuilder } from '../../data-dimensions/categorical/categorical-builder';
import { QuantitativeDateDimensionBuilder } from '../../data-dimensions/quantitative/quantitative-date-builder';
import { QuantitativeNumericDimensionBuilder } from '../../data-dimensions/quantitative/quantitative-numeric-builder';
import { DataMarksBuilder } from '../../data-marks/config/data-marks-builder';

const DEFAULT = {
  _curve: curveLinear,
  _stackOrder: stackOrderNone,
  _stackOffset: stackOffsetNone,
};

@Injectable()
export class VicStackedAreaBuilder<
  Datum,
  TCategoricalValue extends VicDataValue
> extends DataMarksBuilder<Datum> {
  private categoricalDimensionBuilder: CategoricalDimensionBuilder<
    Datum,
    TCategoricalValue
  >;
  private _categoricalOrder: TCategoricalValue[];
  private _curve: CurveFactory;
  private _stackOrder: (
    series: Series<
      [VicContinuousValue, InternMap<TCategoricalValue, number>],
      TCategoricalValue
    >
  ) => Iterable<number>;
  private _stackOffset: (
    series: Series<
      [VicContinuousValue, InternMap<TCategoricalValue, number>],
      TCategoricalValue
    >,
    order: number[]
  ) => void;
  private xDimensionBuilder:
    | QuantitativeNumericDimensionBuilder<Datum>
    | QuantitativeDateDimensionBuilder<Datum>;
  private yDimensionBuilder: QuantitativeNumericDimensionBuilder<Datum>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * Sets the categorical dimension for the stacked area chart.
   */
  createCategoricalDimension(
    setProperties: (
      dimension: CategoricalDimensionBuilder<Datum, TCategoricalValue>
    ) => void
  ): this {
    this.categoricalDimensionBuilder = new CategoricalDimensionBuilder<
      Datum,
      TCategoricalValue
    >();
    this.categoricalDimensionBuilder.range(schemeTableau10 as string[]);
    setProperties(this.categoricalDimensionBuilder);
    return this;
  }

  /**
   * Sets the order of the categorical values.
   */
  categoricalOrder(value: TCategoricalValue[]): this {
    this._categoricalOrder = value;
    return this;
  }

  /**
   * Sets the curve factory for the line.
   */
  curve(value: CurveFactory): this {
    this._curve = value;
    return this;
  }

  /**
   * Sets the order of the stack.
   */
  stackOrder(
    value: (
      series: Series<
        [VicContinuousValue, InternMap<TCategoricalValue, number>],
        TCategoricalValue
      >
    ) => Iterable<number>
  ): this {
    this._stackOrder = value;
    return this;
  }

  /**
   * Sets the offset of the stack.
   */
  stackOffset(
    value: (
      series: Series<
        [VicContinuousValue, InternMap<TCategoricalValue, number>],
        TCategoricalValue
      >,
      order: number[]
    ) => void
  ): this {
    this._stackOffset = value;
    return this;
  }

  /**
   * Sets the x dimension for the stacked area chart.
   */
  createXNumericDimension(
    setProperties: (
      dimension: QuantitativeNumericDimensionBuilder<Datum>
    ) => void
  ): this {
    this.xDimensionBuilder = new QuantitativeNumericDimensionBuilder<Datum>();
    setProperties(this.xDimensionBuilder);
    return this;
  }

  createXDateDimension(
    setProperties: (dimension: QuantitativeDateDimensionBuilder<Datum>) => void
  ): this {
    this.xDimensionBuilder = new QuantitativeDateDimensionBuilder<Datum>();
    setProperties(this.xDimensionBuilder);
    return this;
  }

  createYDimension(
    setProperties: (
      dimension: QuantitativeNumericDimensionBuilder<Datum>
    ) => void
  ): this {
    this.yDimensionBuilder = new QuantitativeNumericDimensionBuilder<Datum>();
    setProperties(this.yDimensionBuilder);
    return this;
  }

  build(): VicStackedAreaConfig<Datum, TCategoricalValue> {
    return new VicStackedAreaConfig({
      categorical: this.categoricalDimensionBuilder.build(),
      categoricalOrder: this._categoricalOrder,
      curve: this._curve,
      data: this._data,
      mixBlendMode: this._mixBlendMode,
      stackOrder: this._stackOrder,
      stackOffset: this._stackOffset,
      x: this.xDimensionBuilder.build(),
      y: this.yDimensionBuilder.build(),
    });
  }
}
