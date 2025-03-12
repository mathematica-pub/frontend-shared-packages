import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxisBaseBuilder } from '../base/config/xy-axis-builder';
import { XOrdinalAxisConfig } from './x-ordinal-axis-config';

const DEFAULT = {
  _side: 'bottom',
  _tickSizeOuter: 0,
  _removeDomainLine: true,
  _zeroAxis: { strokeDasharray: '2', useZeroAxis: true },
};

@Injectable()
export class VicXOrdinalAxisConfigBuilder<
  TickValue extends DataValue,
> extends XyAxisBaseBuilder<TickValue> {
  private _side: 'top' | 'bottom';

  constructor() {
    super();
    Object.assign(this, DEFAULT);
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

  getConfig(): XOrdinalAxisConfig<TickValue> {
    return new XOrdinalAxisConfig<TickValue>({
      grid: this.gridBuilder?._build('x'),
      label: this.labelBuilder?._build('x'),
      marksClass: 'vic-axis-x-ordinal',
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
