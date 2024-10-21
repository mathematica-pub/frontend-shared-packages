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
          dots.config.fill.values[dotDatum.index] ===
            dots.config.fill.valueAccessor(d) &&
          dots.config.radius.values[dotDatum.index] ===
            dots.config.radius.valueAccessor(d)
      );

      const valueFill = dots.config.fill.valueAccessor(datum);
      const tooltipData: DotsTooltipData<Datum> = {
        datum,
        values: {
          fill: valueFill,
          radius: dots.config.radius.valueAccessor(datum),
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
        color: dots.scales.fill(valueFill),
        elRef: elRef,
      };
      return tooltipData;
    }
  }
  return Mixin;
}
