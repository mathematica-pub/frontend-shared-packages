import { ElementRef } from '@angular/core';
import { VicDataValue } from '../core/types/values';
import { ValueUtilities } from '../core/utilities/values';
import { BarDatum, BarsComponent } from './bars.component';

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

export interface VicBarsEventOutput<Datum, TOrdinalValue extends VicDataValue>
  extends VicBarsTooltipOutput<Datum, TOrdinalValue> {
  positionX: number;
  positionY: number;
}

export function getBarsTooltipData<Datum, TOrdinalValue extends VicDataValue>(
  barDatum: BarDatum<TOrdinalValue>,
  elRef: ElementRef,
  bars: BarsComponent<Datum, TOrdinalValue>
): VicBarsTooltipOutput<Datum, TOrdinalValue> {
  const datum = bars.config.data.find(
    (d) =>
      bars.config.quantitative.values[barDatum.index] ===
        bars.config.quantitative.valueAccessor(d) &&
      bars.config.ordinal.values[barDatum.index] ===
        bars.config.ordinal.valueAccessor(d)
  );

  const tooltipData: VicBarsTooltipOutput<Datum, TOrdinalValue> = {
    datum,
    color: bars.getBarColor(barDatum),
    ordinal: bars.config.ordinal.valueAccessor(datum),
    quantitative: bars.config.quantitative.formatFunction
      ? ValueUtilities.customFormat(
          datum,
          bars.config.quantitative.formatFunction
        )
      : ValueUtilities.d3Format(
          bars.config.quantitative.valueAccessor(datum),
          bars.config.quantitative.formatSpecifier
        ),
    category: bars.config.categorical.valueAccessor(datum),
    elRef: elRef,
  };
  return tooltipData;
}
