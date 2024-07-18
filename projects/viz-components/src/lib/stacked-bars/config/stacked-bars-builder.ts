import { Injectable } from '@angular/core';
import {
  schemeTableau10,
  Series,
  stackOffsetDiverging,
  stackOrderNone,
} from 'd3';
import {
  HORIZONTAL_BARS_DIMENSIONS,
  VERTICAL_BARS_DIMENSIONS,
  VicDataValue,
} from 'projects/viz-components/src/public-api';
import { VicBarsBuilder } from '../../bars/config/bars-builder';
import { CategoricalDimensionBuilder } from '../../data-dimensions/categorical/categorical-builder';
import { VicStackedBarsConfig } from './stacked-bars-config';

const DEFAULT = {
  _stackOrder: stackOrderNone,
  _stackOffset: stackOffsetDiverging,
};

@Injectable()
export class VicStackedBarsBuilder<
  Datum,
  TOrdinalValue extends VicDataValue
> extends VicBarsBuilder<Datum, TOrdinalValue> {
  private _stackOffset: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _stackOrder: (x: any) => any;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  override createCategoricalDimension(
    setProperties: (dimension: CategoricalDimensionBuilder<Datum>) => void
  ): this {
    this.categoricalDimensionBuilder = new CategoricalDimensionBuilder<Datum>();
    this.categoricalDimensionBuilder.range(schemeTableau10 as string[]);
    setProperties(this.categoricalDimensionBuilder);
    return this;
  }

  stackOffset(
    stackOffset: (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      series: Series<any, any>,
      order: Iterable<number>
    ) => void
  ): this {
    this._stackOffset = stackOffset;
    return this;
  }

  stackOrder(
    stackOrder: (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      series: Series<any, any>
    ) => Iterable<number>
  ): this {
    this._stackOrder = stackOrder;
    return this;
  }

  override build(): VicStackedBarsConfig<Datum, TOrdinalValue> {
    const dimensions =
      this._orientation === 'horizontal'
        ? HORIZONTAL_BARS_DIMENSIONS
        : VERTICAL_BARS_DIMENSIONS;
    return new VicStackedBarsConfig(dimensions, {
      categorical: this.categoricalDimensionBuilder.build(),
      data: this._data,
      mixBlendMode: this._mixBlendMode,
      ordinal: this.ordinalDimensionBuilder.build(),
      quantitative: this.quantitativeDimensionBuilder.build(),
      labels: this.labelsBuilder?.build(),
      stackOffset: this._stackOffset,
      stackOrder: this._stackOrder,
    });
  }
}
