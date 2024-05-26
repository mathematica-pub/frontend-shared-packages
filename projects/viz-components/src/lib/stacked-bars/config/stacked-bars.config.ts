import {
  InternMap,
  Series,
  extent,
  range,
  rollup,
  schemeTableau10,
  stack,
  stackOffsetDiverging,
  stackOrderNone,
} from 'd3';
import {
  HORIZONTAL_BARS_DIMENSIONS,
  VERTICAL_BARS_DIMENSIONS,
  VicBarsDimensions,
} from '../../bars/config/bars-dimensions';
import { VicBarsConfig, VicBarsOptions } from '../../bars/config/bars.config';
import { VicDataValue } from '../../core/types/values';
import { VicStackDatum } from '../stacked-bars.component';

const DEFAULT = {
  stackOrder: stackOrderNone,
  stackOffset: stackOffsetDiverging,
  categorical: {
    range: schemeTableau10 as string[],
  },
};

export interface VicStackedBarsOptions<
  Datum,
  TOrdinalValue extends VicDataValue
> extends VicBarsOptions<Datum, TOrdinalValue> {
  stackOffset: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stackOrder: (x: any) => any;
}

export class VicStackedBarsConfig<Datum, TOrdinalValue extends VicDataValue>
  extends VicBarsConfig<Datum, TOrdinalValue>
  implements VicStackedBarsOptions<Datum, TOrdinalValue>
{
  stackOffset: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stackOrder: (x: any) => any;
  stackedData: VicStackDatum[][];

  constructor(
    dimensions: VicBarsDimensions,
    options: Partial<VicStackedBarsConfig<Datum, TOrdinalValue>>
  ) {
    super(dimensions, options);
    this.stackOffset = this.stackOffset ?? DEFAULT.stackOffset;
    this.stackOrder = this.stackOrder ?? DEFAULT.stackOrder;
    this.initPropertiesFromData();
  }

  override initPropertiesFromData(): void {
    // parent class will call this method during this class's super call
    // if statement ensure that this prevent this method is only called at the end of this class's constructor
    if (this.stackOffset !== undefined && this.stackOrder !== undefined) {
      this.setDimensionPropertiesFromData();
      this.setValueIndicies();
      this.setHasBarsWithNegativeValues();
      this.constructStackedData();
      this.initQuantitativeDomainFromStack();
    }
  }

  override setValueIndicies(): void {
    this.valueIndicies = range(this.ordinal.values.length).filter((i) => {
      return (
        this.ordinal.domainIncludes(this.ordinal.values[i]) &&
        this.categorical.domainIncludes(this.categorical.values[i])
      );
    });
  }

  constructStackedData(): void {
    const stackedData = stack<[unknown, InternMap<string, number>]>()
      .keys(this.categorical.calculatedDomain)
      .value((d, key) => {
        return this.quantitative.values[d[1].get(key)];
      })
      .order(this.stackOrder)
      .offset(this.stackOffset)(
      rollup(
        this.valueIndicies,
        ([i]) => i,
        (i) => this.ordinal.values[i],
        (i) => this.categorical.values[i]
      )
    );

    this.stackedData = stackedData.map((series) =>
      series.map((d) => {
        Object.assign(d, {
          i: d.data[1].get(series.key),
        });
        return d as unknown as VicStackDatum;
      })
    );
  }

  initQuantitativeDomainFromStack(): void {
    const extents = extent(this.stackedData.flat(2));
    this.quantitative.setUnpaddedDomain(extents);
  }
}

export function vicHorizontalStackedBars<
  Datum,
  TOrdinalValue extends VicDataValue
>(
  options: Partial<VicBarsOptions<Datum, TOrdinalValue>>
): VicStackedBarsConfig<Datum, TOrdinalValue> {
  return new VicStackedBarsConfig(HORIZONTAL_BARS_DIMENSIONS, options);
}

export function vicVerticalStackedBars<
  Datum,
  TOrdinalValue extends VicDataValue
>(
  options: Partial<VicStackedBarsOptions<Datum, TOrdinalValue>>
): VicStackedBarsConfig<Datum, TOrdinalValue> {
  return new VicStackedBarsConfig(VERTICAL_BARS_DIMENSIONS, options);
}
