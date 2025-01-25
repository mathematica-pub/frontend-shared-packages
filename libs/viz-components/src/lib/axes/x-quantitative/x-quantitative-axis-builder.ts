import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxisBaseBuilder } from '../base/config/xy-axis-builder';
import { XQuantitativeAxisConfig } from './x-quantitative-axis-config';

const DEFAULT = {
  _side: 'bottom',
  _tickFormat: ',.1f',
};

@Injectable()
export class VicXQuantitativeAxisConfigBuilder<
  TickValue extends DataValue,
> extends XyAxisBaseBuilder<TickValue> {
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

  getConfig(): XQuantitativeAxisConfig<TickValue> {
    return new XQuantitativeAxisConfig<TickValue>({
      class: 'vic-x-quantitative-axis vic-x-axis vic-quantitative-axis',
      data: undefined,
      label: this.labelBuilder?.build('x'),
      mixBlendMode: this._mixBlendMode,
      numTicks: this._numTicks,
      removeDomainLine: this._removeDomainLine,
      removeTickLabels: this._removeTickLabels,
      removeTickMarks: this._removeTickMarks,
      side: this._side,
      tickFormat: this._tickFormat,
      tickLabelFontSize: this._tickLabelFontSize,
      tickSizeOuter: this._tickSizeOuter,
      tickValues: this._tickValues,
      wrap: this.tickWrapBuilder?.build(),
    });
  }
}
