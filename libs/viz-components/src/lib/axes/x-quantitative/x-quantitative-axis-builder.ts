import { Injectable } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxisBaseBuilder } from '../base/config/xy-axis-builder';
import { GridLinesBuilder } from '../grid-lines/grid-lines-builder';
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
  private gridLinesBuilder: GridLinesBuilder;

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

  gridLines(setProperties?: (gridLines: GridLinesBuilder) => void): this {
    this.initGridLinesBuilder();
    setProperties?.(this.gridLinesBuilder);
    return this;
  }

  private initGridLinesBuilder(): void {
    this.gridLinesBuilder = new GridLinesBuilder();
  }

  getConfig(): XQuantitativeAxisConfig<TickValue> {
    return new XQuantitativeAxisConfig<TickValue>({
      data: undefined,
      mixBlendMode: this._mixBlendMode,
      numTicks: this._numTicks,
      removeDomainLine: this._removeDomainLine,
      removeTickMarks: this._removeTickMarks,
      removeTicks: this._removeTicks,
      side: this._side,
      tickFormat: this._tickFormat,
      tickLabelFontSize: this._tickLabelFontSize,
      tickSizeOuter: this._tickSizeOuter,
      tickValues: this._tickValues,
      gridLines: this.gridLinesBuilder?._build(),
      wrap: this.tickWrapBuilder?._build(),
    });
  }
}
