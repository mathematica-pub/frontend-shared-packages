import { DataValue } from '../../core/types/values';
import { OrdinalChartMultipleDimension } from '../../data-dimensions/ordinal/ordinal-chart-multiple/ordinal-chart-multiple';
import {
  AuxMarksOptions,
  DataMarksOptions,
  MarksOptions,
} from './marks-options';

export abstract class MarksConfig implements MarksOptions {
  readonly marksClass: string;
  readonly mixBlendMode: string;
}

export abstract class AuxMarksConfig<Datum>
  extends MarksConfig
  implements AuxMarksOptions<Datum>
{
  readonly data: Datum[];
  readonly datumClass: (d: Datum, i: number) => string;
}

export abstract class DataMarksConfig<
    Datum,
    ChartMultipleDomain extends DataValue,
  >
  extends AuxMarksConfig<Datum>
  implements DataMarksOptions<Datum, ChartMultipleDomain>
{
  readonly multiples: OrdinalChartMultipleDimension<Datum, ChartMultipleDomain>;
}
