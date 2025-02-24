import { DataValue } from '../../../core';
import { DataMarksConfig } from '../../config/marks-config';
import { DataMarksOptions } from '../../config/marks-options';

export abstract class PrimaryMarksConfig<
    Datum,
    ChartMultipleDomain extends DataValue,
  >
  extends DataMarksConfig<Datum, ChartMultipleDomain>
  implements DataMarksOptions<Datum, ChartMultipleDomain>
{
  protected abstract initPropertiesFromData(): void;
}
