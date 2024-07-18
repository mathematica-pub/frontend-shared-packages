import { Injectable } from '@angular/core';
import {
  VicDataValue,
  VicYOrdinalAxisConfig,
} from 'projects/viz-components/src/public-api';
import { VicXyAxisBuilder } from '../xy-axis-builder';

const DEFAULT = {
  _side: 'left',
};

@Injectable()
export class VicYOrdinalAxisBuilder<
  TickValue extends VicDataValue
> extends VicXyAxisBuilder<TickValue> {
  private _side: 'left' | 'right';
  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  side(side: 'left' | 'right'): this {
    this._side = side;
    return this;
  }

  build(): VicYOrdinalAxisConfig<TickValue> {
    return new VicYOrdinalAxisConfig<TickValue>({
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
