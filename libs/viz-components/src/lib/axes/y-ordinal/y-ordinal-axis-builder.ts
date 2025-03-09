import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxisBaseBuilder } from '../base/config/xy-axis-builder';
import { YOrdinalAxisConfig } from './y-ordinal-axis-config';

const DEFAULT = {
  _side: 'left',
  _tickSizeOuter: 0,
  _removeDomainLine: true,
  _zeroAxis: { strokeDasharray: '2', useZeroAxis: true },
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

  getConfig(): YOrdinalAxisConfig<TickValue> {
    return new YOrdinalAxisConfig<TickValue>({
      grid: this.gridBuilder?._build('y'),
      label: this.labelBuilder?._build('y'),
      marksClass: 'vic-axis-y-ordinal',
      mixBlendMode: this._mixBlendMode,
      removeDomainLine: this._removeDomainLine,
      removeTickLabels: this._removeTickLabels,
      removeTickMarks: this._removeTickMarks,
      rotateTickLabels: this._rotateTickLabels,
      side: this._side,
      tickFormat: this._tickFormat,
      tickLabelFontSize: this._tickLabelFontSize,
      tickSizeOuter: this._tickSizeOuter,
      wrap: this.tickWrapBuilder?._build(),
      zeroAxis: this._zeroAxis,
    });
  }
}
