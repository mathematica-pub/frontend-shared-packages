import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { VicXyAxisBuilder } from '../xy-axis-builder';
import { VicXOrdinalAxisConfig } from './x-ordinal-axis-config';

const DEFAULT = {
  _side: 'bottom',
};

@Injectable()
export class VicXOrdinalAxisBuilder<
  TickValue extends DataValue
> extends VicXyAxisBuilder<TickValue> {
  private _side: 'top' | 'bottom';

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  side(side: 'top' | 'bottom'): this {
    this._side = side;
    return this;
  }

  build(): VicXOrdinalAxisConfig<TickValue> {
    return new VicXOrdinalAxisConfig<TickValue>({
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
