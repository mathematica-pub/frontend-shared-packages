import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { ValueUtilities } from '../../core/utilities/values';
import { LinesComponent } from '../lines.component';
import { LinesEventOutput } from './lines-event-output';

interface LinesTooltip {
  getLinesTooltipData<Datum>(
    datumIndex: number,
    lines: LinesComponent<Datum>
  ): LinesEventOutput<Datum>;
}

// TODO: have this extend a specific class so that we don't need to pass everything in as an argument
export function linesTooltipMixin<T extends AbstractConstructor>(Base: T) {
  abstract class Mixin extends Base implements LinesTooltip {
    getLinesTooltipData<Datum>(
      datumIndex: number,
      lines: LinesComponent<Datum>
    ): LinesEventOutput<Datum> {
      const datum = lines.config.data[datumIndex];
      return {
        datum,
        x: lines.config.x.formatFunction
          ? ValueUtilities.customFormat(datum, lines.config.x.formatFunction)
          : ValueUtilities.d3Format(
              lines.config.x.valueAccessor(datum),
              lines.config.x.formatSpecifier
            ),
        y: lines.config.y.formatFunction
          ? ValueUtilities.customFormat(datum, lines.config.y.formatFunction)
          : ValueUtilities.d3Format(
              lines.config.y.valueAccessor(datum),
              lines.config.y.formatSpecifier
            ),
        category: lines.config.categorical.valueAccessor(datum),
        color: lines.scales.categorical(
          lines.config.categorical.valueAccessor(datum)
        ),
        positionX: lines.scales.x(lines.config.x.values[datumIndex]),
        positionY: lines.scales.y(lines.config.y.values[datumIndex]),
      };
    }
  }
  return Mixin;
}
