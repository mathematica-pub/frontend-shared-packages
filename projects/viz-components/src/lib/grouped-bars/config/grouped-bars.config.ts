import { range } from 'd3';
import {
  HORIZONTAL_BARS_DIMENSIONS,
  VERTICAL_BARS_DIMENSIONS,
  VicBarsDimensions,
} from '../../bars/config/bars-dimensions';
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

  override setValueIndicies(): void {
    this.valueIndicies = range(this.ordinal.values.length).filter((i) => {
      return (
        this.ordinal.domainIncludes(this.ordinal.values[i]) &&
        this.categorical.domainIncludes(this.categorical.values[i])
      );
    });
  }
}

export function vicVerticalGroupedBars<
  Datum,
  TOrdinalValue extends VicDataValue
>(
  options: Partial<VicGroupedBarsOptions<Datum, TOrdinalValue>>
): VicGroupedBarsConfig<Datum, TOrdinalValue> {
  const config = new VicGroupedBarsConfig(VERTICAL_BARS_DIMENSIONS, options);
  return config;
}

export function vicHorizontalGroupedBars<
  Datum,
  TOrdinalValue extends VicDataValue
>(
  options: Partial<VicGroupedBarsOptions<Datum, TOrdinalValue>>
): VicGroupedBarsConfig<Datum, TOrdinalValue> {
  const config = new VicGroupedBarsConfig(HORIZONTAL_BARS_DIMENSIONS, options);
  return config;
}
