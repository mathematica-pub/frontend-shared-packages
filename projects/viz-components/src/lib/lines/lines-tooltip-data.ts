import { formatValue } from '../value-format/value-format';
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
      lines.config.category.values[datumIndex] ===
        lines.config.category.valueAccessor(d)
  );
  return {
    datum,
    x: formatValue(
      lines.config.x.valueAccessor(datum),
      lines.config.x.valueFormat
    ),
    y: formatValue(
      lines.config.y.valueAccessor(datum),
      lines.config.y.valueFormat
    ),
    category: lines.config.category.valueAccessor(datum),
    color: lines.scales.category(lines.config.category.valueAccessor(datum)),
    positionX: lines.scales.x(lines.config.x.values[datumIndex]),
    positionY: lines.scales.y(lines.config.y.values[datumIndex]),
  };
}
