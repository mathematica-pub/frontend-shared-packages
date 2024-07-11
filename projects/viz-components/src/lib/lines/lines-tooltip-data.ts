import { ValueUtilities } from '../core/utilities/values';
import { LinesComponent } from './lines.component';

export interface VicLinesEventOutput<Datum> {
  datum: Datum;
  x: string;
  y: string;
  category: string;
  color: string;
  positionX: number;
  positionY: number;
}

export function getLinesTooltipDataFromDatum<Datum>(
  datumIndex: number,
  lines: LinesComponent<Datum>
): VicLinesEventOutput<Datum> {
  const datum = lines.config.data.find(
    (d) =>
      lines.config.x.values[datumIndex] === lines.config.x.valueAccessor(d) &&
      lines.config.categorical.values[datumIndex] ===
        lines.config.categorical.valueAccessor(d)
  );
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
