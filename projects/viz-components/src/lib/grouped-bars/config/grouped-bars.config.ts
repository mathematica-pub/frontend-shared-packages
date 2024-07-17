import { range } from 'd3';
import { VicBarsConfig } from '../../bars/config/bars-config';
import { VicBarsDimensions } from '../../bars/config/bars-dimensions';
import { VicDataValue } from '../../core/types/values';
import { VicGroupedBarsOptions } from './grouped-bars-options';

const DEFAULT = {
  intraGroupPadding: 0.05,
};

export class VicGroupedBarsConfig<Datum, TOrdinalValue extends VicDataValue>
  extends VicBarsConfig<Datum, TOrdinalValue>
  implements VicGroupedBarsOptions<Datum, TOrdinalValue>
{
  intraGroupPadding: number;

  constructor(
    dimensions: VicBarsDimensions,
    options: VicGroupedBarsOptions<Datum, TOrdinalValue>
  ) {
    super(dimensions, options);
    Object.assign(this, DEFAULT, options);
    this.initPropertiesFromData();
  }

  override setValueIndices(): void {
    this.valueIndices = range(this.ordinal.values.length).filter((i) => {
      return (
        this.ordinal.domainIncludes(this.ordinal.values[i]) &&
        this.categorical.domainIncludes(this.categorical.values[i])
      );
    });
  }
}
