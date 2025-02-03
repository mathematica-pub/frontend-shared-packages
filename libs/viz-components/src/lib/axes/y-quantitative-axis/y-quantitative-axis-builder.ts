import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxisBaseBuilder } from '../base/config/xy-axis-builder';
import { YQuantitativeAxisConfig } from './y-quantitative-axis-config';

const DEFAULT = {
  _side: 'left',
  _tickFormat: ',.1f',
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
   * OPTIONAL. The number of ticks to pass to D3's axis.ticks().
   *
   * If not provided, D3 will determine the number of ticks.
   *
   * To unset the number of ticks, call with null.
   */
  numTicks(numTicks: number | null): this {
    if (numTicks === null) {
      this._numTicks = undefined;
      return this;
    }
    this._numTicks = numTicks;
    return this;
  }

  /**
   * OPTIONAL. The side of the chart where the axis will be placed.
   *
   * @default 'left'
   */
  side(side: 'left' | 'right'): this {
    this._side = side;
    return this;
  }

  /**
   * OPTIONAL. The tick values to pass to D3's axis.tickValues().
   *
   * To unset the tick values, call with null.
   */
  tickValues(tickValues: TickValue[] | null): this {
    if (tickValues === null) {
      this._tickValues = undefined;
      return this;
    }
    this._tickValues = tickValues;
    return this;
  }

  getConfig(): YQuantitativeAxisConfig<TickValue> {
    return new YQuantitativeAxisConfig<TickValue>({
      data: undefined,
      grid: this.gridBuilder?._build('y'),
      label: this.labelBuilder?._build('y'),
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
    });
  }
}
