import { range } from 'd3';
import { VicBarsDimensions } from '../../bars/config/bars-dimensions';
import { VicBarsConfig, VicBarsOptions } from '../../bars/config/bars.config';
import { VicDataValue } from '../../core/types/values';

const DEFAULT = {
  intraGroupPadding: 0.05,
};

export interface VicGroupedBarsOptions<
  Datum,
  TOrdinalValue extends VicDataValue
> extends VicBarsOptions<Datum, TOrdinalValue> {
  intraGroupPadding: number;
}

export class VicGroupedBarsConfig<Datum, TOrdinalValue extends VicDataValue>
  extends VicBarsConfig<Datum, TOrdinalValue>
  implements VicGroupedBarsOptions<Datum, TOrdinalValue>
{
  intraGroupPadding: number;

  constructor(
    dimensions: VicBarsDimensions,
    options: Partial<VicGroupedBarsOptions<Datum, TOrdinalValue>>
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
