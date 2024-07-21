import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { VicXyAxisBuilder } from '../config/xy-axis-builder';
import { YQuantitativeAxisConfig } from './y-quantitative-axis-config';

const DEFAULT = {
  _side: 'left',
  _tickFormat: ',.1f',
};

@Injectable()
export class VicYQuantitativeAxisBuilder<
  TickValue extends DataValue
> extends VicXyAxisBuilder<TickValue> {
  private _numTicks: number;
  private _side: 'left' | 'right';
  private _tickValues: TickValue[];

  constructor() {
    super();
    Object.assign(this, DEFAULT);
  }

  numTicks(numTicks: number): this {
    this._numTicks = numTicks;
    return this;
  }

  side(side: 'left' | 'right'): this {
    this._side = side;
    return this;
  }

  tickValues(tickValues: TickValue[]): this {
    this._tickValues = tickValues;
    return this;
  }

  build(): YQuantitativeAxisConfig<TickValue> {
    return new YQuantitativeAxisConfig<TickValue>({
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
