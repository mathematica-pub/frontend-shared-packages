import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxisBaseBuilder } from '../base/config/xy-axis-builder';
import { YOrdinalAxisConfig } from './y-ordinal-axis-config';

const DEFAULT = {
  _side: 'left',
};

@Injectable()
export class VicYOrdinalAxisBuilder<
  TickValue extends DataValue
> extends XyAxisBaseBuilder<TickValue> {
  private _side: 'left' | 'right';
  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  side(side: 'left' | 'right'): this {
    this._side = side;
    return this;
  }

  build(): YOrdinalAxisConfig<TickValue> {
    return new YOrdinalAxisConfig<TickValue>({
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
