import { safeAssign } from '@mathstack/app-kit';
import { range } from 'd3';
import { BarsConfig } from '../../bars/config/bars-config';
import { BarsDimensions } from '../../bars/config/bars-dimensions';
import { DataValue } from '../../core/types/values';
import { GroupedBarsOptions } from './grouped-bars-options';

const DEFAULT = {
  intraGroupPadding: 0.05,
};

export class GroupedBarsConfig<Datum, TOrdinalValue extends DataValue>
  extends BarsConfig<Datum, TOrdinalValue>
  implements GroupedBarsOptions<Datum, TOrdinalValue>
{
  intraGroupPadding: number;

  constructor(
    dimensions: BarsDimensions,
    options: GroupedBarsOptions<Datum, TOrdinalValue>
  ) {
    super(dimensions, options);
    safeAssign(this, DEFAULT);
    safeAssign(this, options);
    this.initPropertiesFromData();
  }

  override setValueIndices(): void {
    this.valueIndices = range(this.ordinal.values.length).filter((i) => {
      return (
        this.ordinal.domainIncludes(this.ordinal.values[i]) &&
        this.color.domainIncludes(this.color.values[i])
      );
    });
  }

  override setBarsKeyFunction(): void {
    this.barsKeyFunction = (i: number): string =>
      `${this.color.values[i]}-${this.ordinal.values[i]}`;
  }
}
