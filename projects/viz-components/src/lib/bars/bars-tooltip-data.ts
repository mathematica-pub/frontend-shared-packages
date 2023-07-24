import { ElementRef } from '@angular/core';
import { formatValue } from '../value-format/value-format';
import { BarsComponent } from './bars.component';

export interface BarsEventOutput extends BarsTooltipOutput {
  positionX: number;
  positionY: number;
}

export interface BarsTooltipOutput {
  datum: any;
  color: string;
  ordinal: string;
  quantitative: string;
  category: string;
  elRef: ElementRef;
}

export function getBarsTooltipData(
  barIndex: number,
  elRef: ElementRef,
  bars: BarsComponent
): BarsTooltipOutput {
  const datum = bars.config.data.find(
    (d) =>
      bars.values[bars.config.dimensions.quantitative][barIndex] ===
        bars.config.quantitative.valueAccessor(d) &&
      bars.values[bars.config.dimensions.ordinal][barIndex] ===
        bars.config.ordinal.valueAccessor(d)
  );

  const tooltipData: BarsTooltipOutput = {
    datum,
    color: bars.getBarColor(barIndex),
    ordinal: bars.config.ordinal.valueAccessor(datum),
    quantitative: formatValue(
      bars.config.quantitative.valueAccessor(datum),
      bars.config.quantitative.valueFormat
    ),
    category: bars.config.category.valueAccessor(datum),
    elRef: elRef,
  };

  return tooltipData;
}
