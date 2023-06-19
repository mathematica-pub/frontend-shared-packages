import { ElementRef } from '@angular/core';
import { BarsComponent } from './bars.component';

export interface BarsEmittedOutput {
  datum: any;
  color: string;
  ordinal: string;
  quantitative: string;
  category: string;
  elRef: ElementRef;
  positionX?: number;
  positionY?: number;
}

export function getBarsTooltipData(
  barIndex: number,
  elRef: ElementRef,
  bars: BarsComponent
): BarsEmittedOutput {
  const datum = bars.config.data.find(
    (d) =>
      bars.values[bars.config.dimensions.quantitative][barIndex] ===
        bars.config.quantitative.valueAccessor(d) &&
      bars.values[bars.config.dimensions.ordinal][barIndex] ===
        bars.config.ordinal.valueAccessor(d)
  );

  const tooltipData: BarsEmittedOutput = {
    datum,
    color: bars.getBarColor(barIndex),
    ordinal: bars.config.ordinal.valueAccessor(datum),
    quantitative: bars.config.quantitative.valueAccessor(datum),
    category: bars.config.category.valueAccessor(datum),
    elRef: elRef,
  };

  return tooltipData;
}
