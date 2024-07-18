import { Injectable } from '@angular/core';
import {
  VicDataValue,
  VicXQuantitativeAxisConfig,
} from 'projects/viz-components/src/public-api';
import { VicXyAxisBuilder } from '../xy-axis-builder';

const DEFAULT = {
  _side: 'bottom',
  _tickFormat: ',.1f',
};

@Injectable()
export class VicXQuantitativeAxisBuilder<
  TickValue extends VicDataValue
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

  build(): VicXQuantitativeAxisConfig<TickValue> {
    return new VicXQuantitativeAxisConfig<TickValue>({
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
