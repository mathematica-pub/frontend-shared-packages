import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxisBaseBuilder } from '../base/config/xy-axis-builder';
import { YOrdinalAxisConfig } from './y-ordinal-axis-config';

const DEFAULT = {
  _side: 'left',
  _tickSizeOuter: 0,
  _removeDomainLine: 'unlessZeroAxis',
  _zeroAxisStroke: '2',
};

@Injectable()
export class VicYOrdinalAxisConfigBuilder<
  TickValue extends DataValue,
> extends XyAxisBaseBuilder<TickValue> {
  private _side: 'left' | 'right';
  constructor() {
    super();
    Object.assign(this, DEFAULT);
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

  getConfig(): YOrdinalAxisConfig<TickValue> {
    return new YOrdinalAxisConfig<TickValue>({
      grid: this.gridBuilder?._build('y'),
      label: this.labelBuilder?._build('y'),
      marksClass: 'vic-axis-y-ordinal',
      mixBlendMode: this._mixBlendMode,
      removeDomainLine: this._removeDomainLine,
      removeTickLabels: this._removeTickLabels,
      removeTickMarks: this._removeTickMarks,
      side: this._side,
      tickFormat: this._tickFormat,
      tickLabelFontSize: this._tickLabelFontSize,
      tickSizeOuter: this._tickSizeOuter,
      wrap: this.tickWrapBuilder?._build(),
      zeroAxisStroke: this._zeroAxisStroke,
    });
  }
}
