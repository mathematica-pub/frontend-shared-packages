import { Injectable } from '@angular/core';
import { ContinuousValue } from '../../core/types/values';
import { XyAxisBaseBuilder } from '../base/config/xy-axis-builder';
import { QuantitativeTicksBuilder } from '../ticks/ticks-builder';
import { VicYQuantitativeAxisConfig } from './y-quantitative-axis-config';

const DEFAULT = {
  _side: 'left',
  _removeDomainLine: false,
  _zeroAxis: { strokeDasharray: '2', useZeroAxis: true },
};

const TICKS_DEFAULT = {
  _format: ',.1f',
};

@Injectable()
export class VicYQuantitativeAxisConfigBuilder<
  Tick extends ContinuousValue,
> extends XyAxisBaseBuilder {
  private _side: 'left' | 'right';
  private ticksBuilder: QuantitativeTicksBuilder<Tick>;

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
   * If not called, the default value is `left`.
   */
  side(value: 'left' | 'right'): this {
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
    return new QuantitativeTicksBuilder<Tick>(TICKS_DEFAULT);
  }

  getConfig(): VicYQuantitativeAxisConfig<Tick> {
    return new VicYQuantitativeAxisConfig<Tick>({
      baseline: this.baselineBuilder._build(),
      grid: this.gridBuilder?._build('y'),
      label: this.labelBuilder?._build('y'),
      marksClass: 'vic-axis-y-quantitative',
      mixBlendMode: this._mixBlendMode,
      side: this._side,
      ticks: this.ticksBuilder._build(),
    });
  }
}
