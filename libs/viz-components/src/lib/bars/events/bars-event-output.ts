import { DataValue } from '../../core/types/values';
import { BarsTooltipDatum } from '../bars.component';

export interface BarsEventOutput<
  Datum,
  OrdinalDomain extends DataValue,
  ChartMultipleDomain extends DataValue = string,
> extends BarsTooltipDatum<Datum, OrdinalDomain, ChartMultipleDomain> {
  origin: SVGRectElement;
  positionX: number;
  positionY: number;
}
