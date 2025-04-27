import { Injectable } from '@angular/core';
import { ContinuousValue } from '../../core/types/values';
import { XyAxisBaseBuilder } from '../base/config/xy-axis-builder';
import { QuantitativeTicksBuilder } from '../ticks/ticks-builder';
import { VicXQuantitativeAxisConfig } from './x-quantitative-axis-config';

const DEFAULT = {
  _side: 'bottom',
  _removeDomainLine: false,
  _zeroAxis: { strokeDasharray: '2', useZeroAxis: true },
};

const TICK_DEFAULT = {
  _format: ',.1f',
};

@Injectable()
export class VicXQuantitativeAxisConfigBuilder<
  Tick extends ContinuousValue,
> extends XyAxisBaseBuilder {
  private ticksBuilder: QuantitativeTicksBuilder<Tick>;
  private _side: 'top' | 'bottom';

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
  ticks(ticks: (ticks: QuantitativeTicksBuilder<Tick>) => void): this;
  ticks(ticks: null): this;
  ticks(ticks: ((ticks: QuantitativeTicksBuilder<Tick>) => void) | null): this {
    this.ticksBuilder = this.getTicksBuilder();
    if (ticks === null) {
      return this;
    }
    ticks?.(this.ticksBuilder);
    return this;
  }

  private getTicksBuilder(): QuantitativeTicksBuilder<Tick> {
    return new QuantitativeTicksBuilder<Tick>(TICK_DEFAULT);
  }

  getConfig(): VicXQuantitativeAxisConfig<Tick> {
    return new VicXQuantitativeAxisConfig<Tick>({
      baseline: this.baselineBuilder._build('quantitative'),
      grid: this.gridBuilder?._build('x', 'quantitative'),
      label: this.labelBuilder?._build('x'),
      marksClass: 'vic-axis-x-quantitative',
      mixBlendMode: this._mixBlendMode,
      side: this._side,
      ticks: this.ticksBuilder._build('x'),
    });
  }
}
