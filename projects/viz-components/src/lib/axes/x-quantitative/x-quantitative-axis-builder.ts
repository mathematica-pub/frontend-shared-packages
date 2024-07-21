import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { VicXyAxisBuilder } from '../config/xy-axis-builder';
import { XQuantitativeAxisConfig } from './x-quantitative-axis-config';

const DEFAULT = {
  _side: 'bottom',
  _tickFormat: ',.1f',
};

@Injectable()
export class VicXQuantitativeAxisBuilder<
  TickValue extends DataValue
> extends VicXyAxisBuilder<TickValue> {
  private _numTicks: number;
  private _side: 'top' | 'bottom';
  private _tickValues: TickValue[];

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  numTicks(numTicks: number): this {
    this._numTicks = numTicks;
    return this;
  }

  side(side: 'top' | 'bottom'): this {
    this._side = side;
    return this;
  }

  tickValues(tickValues: TickValue[]): this {
    this._tickValues = tickValues;
    return this;
  }

  build(): XQuantitativeAxisConfig<TickValue> {
    return new XQuantitativeAxisConfig<TickValue>({
      numTicks: this._numTicks,
      removeDomain: this._removeDomain,
      removeTickMarks: this._removeTickMarks,
      removeTicks: this._removeTicks,
      side: this._side,
      tickFormat: this._tickFormat,
      tickLabelFontSize: this._tickLabelFontSize,
      tickSizeOuter: this._tickSizeOuter,
      tickValues: this._tickValues,
      wrap: this.tickWrapBuilder?.build(),
    });
  }
}
