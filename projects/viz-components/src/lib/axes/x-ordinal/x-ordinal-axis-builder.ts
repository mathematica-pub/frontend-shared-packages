import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxisBaseBuilder } from '../base/config/xy-axis-builder';
import { XOrdinalAxisConfig } from './x-ordinal-axis-config';

const DEFAULT = {
  _side: 'bottom',
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

  side(side: 'top' | 'bottom'): this {
    this._side = side;
    return this;
  }

  getConfig(): XOrdinalAxisConfig<TickValue> {
    return new XOrdinalAxisConfig<TickValue>({
      removeDomain: this._removeDomain,
      removeTickMarks: this._removeTickMarks,
      removeTicks: this._removeTicks,
      side: this._side,
      tickFormat: this._tickFormat,
      tickLabelFontSize: this._tickLabelFontSize,
      tickSizeOuter: this._tickSizeOuter,
      wrap: this.tickWrapBuilder?.build(),
    });
  }
}
