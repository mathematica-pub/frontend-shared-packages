import { ElementRef } from '@angular/core';
import { AbstractConstructor } from '../core/common-behaviors/constructor';
import { DataValue } from '../core/types/values';
import { ValueUtilities } from '../core/utilities/values';
import { BarDatum, BarsComponent } from './bars.component';

export interface BarsTooltipOutput<Datum, TOrdinalValue extends DataValue> {
  datum: Datum;
  color: string;
  ordinal: TOrdinalValue;
  quantitative: string;
  category: string;
  elRef: ElementRef;
}

export interface BarsTooltip {
  getBarsTooltipData<Datum, TOrdinalValue extends DataValue>(
    barDatum: BarDatum<TOrdinalValue>,
    elRef: ElementRef,
    bars: BarsComponent<Datum, TOrdinalValue>
  ): BarsTooltipOutput<Datum, TOrdinalValue>;
}

export function barsTooltipMixin<T extends AbstractConstructor>(Base: T) {
  abstract class Mixin extends Base implements BarsTooltip {
    // Step 2: Implement the empty function
    getBarsTooltipData<Datum, TOrdinalValue extends DataValue>(
      barDatum: BarDatum<TOrdinalValue>,
      elRef: ElementRef,
      bars: BarsComponent<Datum, TOrdinalValue>
    ): BarsTooltipOutput<Datum, TOrdinalValue> {
      const datum = bars.config.data.find(
        (d) =>
          bars.config.quantitative.values[barDatum.index] ===
            bars.config.quantitative.valueAccessor(d) &&
          bars.config.ordinal.values[barDatum.index] ===
            bars.config.ordinal.valueAccessor(d)
      );

      const tooltipData: BarsTooltipOutput<Datum, TOrdinalValue> = {
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
  }
  return Mixin;
}
