import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxisBaseBuilder } from '../base/config/xy-axis-builder';
import { YOrdinalAxisConfig } from './y-ordinal-axis-config';

const DEFAULT = {
  _side: 'left',
  _tickSizeOuter: 0,
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

  side(side: 'left' | 'right'): this {
    this._side = side;
    return this;
  }

  getConfig(): YOrdinalAxisConfig<TickValue> {
    return new YOrdinalAxisConfig<TickValue>({
      data: undefined,
      label: this.labelBuilder?._build('y'),
      mixBlendMode: this._mixBlendMode,
      removeDomainLine: this._removeDomainLine,
      removeTickLabels: this._removeTickLabels,
      removeTickMarks: this._removeTickMarks,
      side: this._side,
      tickFormat: this._tickFormat,
      tickLabelFontSize: this._tickLabelFontSize,
      tickSizeOuter: this._tickSizeOuter,
      wrap: this.tickWrapBuilder?._build(),
    });
  }
}
