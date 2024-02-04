import { formatValue } from '../value-format/value-format';
import { LinesComponent } from './lines.component';

export interface VicLinesEventOutput<T> {
  datum: T;
  x: string;
  y: string;
  category: string;
  color: string;
  positionX: number;
  positionY: number;
}

export function getLinesTooltipDataFromDatum<T>(
  datumIndex: number,
  lines: LinesComponent<T>
): VicLinesEventOutput<T> {
  const datum = lines.config.data.find(
    (d) =>
      lines.values.x[datumIndex] === lines.config.x.valueAccessor(d) &&
      lines.values.category[datumIndex] ===
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
    positionX: lines.scales.x(lines.values.x[datumIndex]),
    positionY: lines.scales.y(lines.values.y[datumIndex]),
  };
}
