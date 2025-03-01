import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxisBaseBuilder } from '../base/config/xy-axis-builder';
import { TicksBuilder } from '../ticks/ticks-builder';
import { VicXOrdinalAxisConfig } from './x-ordinal-axis-config';

const DEFAULT = {
  _side: 'bottom',
  _baseline: {
    display: false,
  },
};

const TICK_DEFAULT = {
  _sizeOuter: 0,
};

@Injectable()
export class VicXOrdinalAxisConfigBuilder<
  Tick extends DataValue,
> extends XyAxisBaseBuilder {
  private _side: 'top' | 'bottom';
  private ticksBuilder: TicksBuilder<Tick>;

  constructor() {
    super();
    Object.assign(this, DEFAULT);
    this.ticksBuilder = this.getTicksBuilder();
  }

  /**
   * OPTIONAL. Specifies the location of the axis on the chart.
   *
   * @param value - The side of the chart where the axis will be placed.
   *
   * If not called, the default value is `bottom`.
   */
  side(value: 'top' | 'bottom'): this {
    this._side = value;
    return this;
  }

  /**
   * OPTIONAL. Specifies properties for axis ticks.
   *
   * @param ticks - A function that specifies properties for axis ticks.
   */
  ticks(ticks: (ticks: TicksBuilder<Tick>) => void): this;
  ticks(ticks: null): this;
  ticks(ticks: ((ticks: TicksBuilder<Tick>) => void) | null): this {
    this.ticksBuilder = this.getTicksBuilder();
    if (ticks === null) {
      return this;
    }
    ticks?.(this.ticksBuilder);
    return this;
  }

  private getTicksBuilder(): TicksBuilder<Tick> {
    return new TicksBuilder<Tick>(TICK_DEFAULT);
  }

  getConfig(): VicXOrdinalAxisConfig<Tick> {
    return new VicXOrdinalAxisConfig<Tick>({
      baseline: this.baselineBuilder?._build('ordinal'),
      grid: this.gridBuilder?._build('x'),
      label: this.labelBuilder?._build('x'),
      marksClass: 'vic-axis-x-ordinal',
      mixBlendMode: this._mixBlendMode,
      side: this._side,
      ticks: this.ticksBuilder._build(),
    });
  }
}
