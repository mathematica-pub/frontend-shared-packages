import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxisBaseBuilder } from '../base/config/xy-axis-builder';
import { YQuantitativeAxisConfig } from './y-quantitative-axis-config';

const DEFAULT = {
  _side: 'left',
  _tickFormat: ',.1f',
  _removeDomainLine: 'never',
  _zeroAxisStroke: '2',
};

@Injectable()
export class VicYQuantitativeAxisConfigBuilder<
  TickValue extends DataValue,
> extends XyAxisBaseBuilder<TickValue> {
  private _numTicks: number;
  private _side: 'left' | 'right';
  private _tickValues: TickValue[];

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Approximately specifies the number of ticks for the axis.
   *
   * @param value - The number of ticks to pass to D3's axis.ticks(), or null to unset the number of ticks.
   *
   * If not called, a reasonable and valid default will be used based on the size of the chart.
   *
   * Note that this number will be passed to D3's `ticks()` method and therefore it can be an approximate number of ticks.
   */
  numTicks(value: number | null): this {
    if (value === null) {
      this._numTicks = undefined;
      return this;
    }
    this._numTicks = value;
    return this;
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
   * OPTIONAL. Determines the values that will show up as ticks on the axis.
   *
   * @param values - An array of quantitative values to pass to D3's axis.tickValues(), or null to unset the tick values.
   *
   */
  tickValues(values: TickValue[] | null): this {
    if (values === null) {
      this._tickValues = undefined;
      return this;
    }
    this._tickValues = values;
    return this;
  }

  getConfig(): YQuantitativeAxisConfig<TickValue> {
    return new YQuantitativeAxisConfig<TickValue>({
      grid: this.gridBuilder?._build('y'),
      label: this.labelBuilder?._build('y'),
      marksClass: 'vic-axis-y-quantitative',
      mixBlendMode: this._mixBlendMode,
      numTicks: this._numTicks,
      removeDomainLine: this._removeDomainLine,
      removeTickLabels: this._removeTickLabels,
      removeTickMarks: this._removeTickMarks,
      side: this._side,
      tickFormat: this._tickFormat,
      tickLabelFontSize: this._tickLabelFontSize,
      tickSizeOuter: this._tickSizeOuter,
      tickValues: this._tickValues,
      wrap: this.tickWrapBuilder?._build(),
      zeroAxisStroke: this._zeroAxisStroke,
    });
  }
}
