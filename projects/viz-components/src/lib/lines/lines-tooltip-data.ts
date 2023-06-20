import { formatValue } from '../value-format/value-format';
import { LinesComponent } from './lines.component';

export interface LinesEventOutput {
  datum: any;
  x: string;
  y: string;
  category: string;
  color: string;
  positionX: number;
  positionY: number;
}

export function getLinesTooltipDataFromDatum(
  datumIndex: number,
  lines: LinesComponent
): LinesEventOutput {
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
    color: lines.categoryScale(lines.config.category.valueAccessor(datum)),
    positionX: lines.xScale(lines.values.x[datumIndex]),
    positionY: lines.yScale(lines.values.y[datumIndex]),
  };
}
