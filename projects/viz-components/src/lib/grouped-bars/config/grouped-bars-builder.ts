import { Injectable } from '@angular/core';
import {
  HORIZONTAL_BARS_DIMENSIONS,
  VERTICAL_BARS_DIMENSIONS,
  VicDataValue,
} from 'projects/viz-components/src/public-api';
import { VicBarsBuilder } from '../../bars/config/bars-builder';
import { VicGroupedBarsConfig } from './grouped-bars.config';

const DEFAULT = {
  intraGroupPadding: 0.05,
};

@Injectable()
export class VicGroupedBarsBuilder<
  Datum,
  TOrdinalValue extends VicDataValue
> extends VicBarsBuilder<Datum, TOrdinalValue> {
  private _intraGroupPadding: number;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  intraGroupPadding(padding: number): this {
    this._intraGroupPadding = padding;
    return this;
  }

  override build(): VicGroupedBarsConfig<Datum, TOrdinalValue> {
    const dimensions =
      this._orientation === 'horizontal'
        ? HORIZONTAL_BARS_DIMENSIONS
        : VERTICAL_BARS_DIMENSIONS;
    return new VicGroupedBarsConfig(dimensions, {
      categorical: this.categoricalDimensionBuilder.build(),
      data: this._data,
      intraGroupPadding: this._intraGroupPadding,
      labels: this.labelsBuilder ? this.labelsBuilder.build() : undefined,
      mixBlendMode: this._mixBlendMode,
      ordinal: this.ordinalDimensionBuilder.build(),
      quantitative: this.quantitativeDimensionBuilder.build(),
    });
  }
}
