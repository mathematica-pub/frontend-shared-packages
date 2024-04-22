import { ElementRef } from '@angular/core';
import { VicDataValue } from '../../public-api';
import { formatValue } from '../value-format/value-format';
import { BarsComponent } from './bars.component';

export interface VicBarsEventOutput<Datum, TOrdinalValue extends VicDataValue>
  extends VicBarsTooltipOutput<Datum, TOrdinalValue> {
  positionX: number;
  positionY: number;
}

export interface VicBarsTooltipOutput<
  Datum,
  TOrdinalValue extends VicDataValue
> {
  datum: Datum;
  color: string;
  ordinal: TOrdinalValue;
  quantitative: string;
  category: string;
  elRef: ElementRef;
}

export function getBarsTooltipData<Datum, TOrdinalValue extends VicDataValue>(
  barIndex: number,
  elRef: ElementRef,
  bars: BarsComponent<Datum, TOrdinalValue>
): VicBarsTooltipOutput<Datum, TOrdinalValue> {
  const datum = bars.config.data.find(
    (d) =>
      bars.values[bars.config.dimensions.quantitative][barIndex] ===
        bars.config.quantitative.valueAccessor(d) &&
      bars.values[bars.config.dimensions.ordinal][barIndex] ===
        bars.config.ordinal.valueAccessor(d)
  );

  const tooltipData: VicBarsTooltipOutput<Datum, TOrdinalValue> = {
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
