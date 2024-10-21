import { ElementRef } from '@angular/core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { ValueUtilities } from '../../core/utilities/values';
import { DotDatum, DotsComponent } from '../dots.component';
import { DotsTooltipData } from './dots-event-output';

interface DotsTooltip {
  getDotsTooltipData<Datum>(
    dotDatum: DotDatum,
    elRef: ElementRef,
    dots: DotsComponent<Datum>
  ): DotsTooltipData<Datum>;
}

// TODO: have this extend a specific class so that we don't need to pass everything in as an argument
export function dotsTooltipMixin<T extends AbstractConstructor>(Base: T) {
  abstract class Mixin extends Base implements DotsTooltip {
    // Step 2: Implement the empty function
    getDotsTooltipData<Datum>(
      dotDatum: DotDatum,
      elRef: ElementRef,
      dots: DotsComponent<Datum>
    ): DotsTooltipData<Datum> {
      const datum = dots.config.data.find(
        (d) =>
          dots.config.x.values[dotDatum.index] ===
            dots.config.x.valueAccessor(d) &&
          dots.config.y.values[dotDatum.index] ===
            dots.config.y.valueAccessor(d) && 
          dots.config.color.values[dotDatum.index] ===
            dots.config.color.valueAccessor(d) &&
      );

      const tooltipData: DotsTooltipData<Datum> = {
        datum,
        values: {
          color: dots.config.color.valueAccessor(datum),
          radius: dots.config.ordinal.valueAccessor(datum),
          x: dots.config.x.formatFunction
            ? ValueUtilities.customFormat(datum, dots.config.x.formatFunction)
            : ValueUtilities.d3Format(
                dots.config.x.valueAccessor(datum),
                dots.config.x.formatSpecifier
              ),
          y: dots.config.y.formatFunction
            ? ValueUtilities.customFormat(datum, dots.config.y.formatFunction)
            : ValueUtilities.d3Format(
                dots.config.y.valueAccessor(datum),
                dots.config.y.formatSpecifier
              ),
        },
        elRef: elRef,
      };
      return tooltipData;
    }
  }
  return Mixin;
}
