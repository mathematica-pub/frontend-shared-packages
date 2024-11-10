import { Injectable } from '@angular/core';
import { Series, stackOffsetDiverging, stackOrderNone } from 'd3';
import { VicBarsConfigBuilder } from '../../bars/config/bars-builder';
import { DataValue } from '../../core/types/values';
import { StackedBarsConfig } from './stacked-bars-config';

const DEFAULT = {
  _stackOrder: stackOrderNone,
  _stackOffset: stackOffsetDiverging,
};

/**
 * Builds a configuration object for a StackedBarsComponent.
 *
 * Must be added to a providers array in or above the component that consumes it if it is injected via the constructor. (e.g. `providers: [VicStackedBarsBuilder]` in the component decorator)
 *
 * The first generic parameter, Datum, is the type of the data that will be used to create the stacked bars.
 *
 * The second generic parameter, TOrdinalValue, is the type of the ordinal data that will be used to position the bars.
 */
@Injectable()
export class VicStackedBarsConfigBuilder<
  Datum,
  TOrdinalValue extends DataValue,
> extends VicBarsConfigBuilder<Datum, TOrdinalValue> {
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

  override getConfig(): StackedBarsConfig<Datum, TOrdinalValue> {
    this.validateBuilder('Stacked Bars');
    return new StackedBarsConfig(this.dimensions, {
      color: this.colorDimensionBuilder._build('Color'),
      data: this._data,
      customFills: this._customFills,
      mixBlendMode: this._mixBlendMode,
      ordinal: this.ordinalDimensionBuilder._build(
        'band',
        this.getOrdinalDimensionName()
      ),
      quantitative: this.quantitativeDimensionBuilder._build(
        this.getQuantitativeDimensionName()
      ),
      labels: this.labelsBuilder?._build(),
      stackOffset: this._stackOffset,
      stackOrder: this._stackOrder,
    });
  }
}
