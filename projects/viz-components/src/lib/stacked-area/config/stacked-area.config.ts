import {
  curveLinear,
  extent,
  InternMap,
  range,
  rollup,
  schemeTableau10,
  Series,
  SeriesPoint,
  stack,
  stackOffsetNone,
  stackOrderNone,
} from 'd3';
import { VicDataMarksOptions } from '../../data-marks/data-marks-types';
import { VicCategoricalDimension } from '../../data-marks/dimensions/categorical-dimension';
import { VicDataValue } from '../../data-marks/dimensions/data-dimension';
import { VicDateDimension } from '../../data-marks/dimensions/date-dimension';
import { VicQuantitativeDimension } from '../../data-marks/dimensions/quantitative-dimension';
import { VicXyDataMarksConfig } from '../../xy-data-marks/xy-data-marks-config';

const DEFAULT = {
  curve: curveLinear,
  stackOrder: stackOrderNone,
  stackOffset: stackOffsetNone,
  categorical: {
    range: schemeTableau10 as string[],
  },
};

export class VicStackedAreaConfig<Datum, TCategoricalValue extends VicDataValue>
  extends VicXyDataMarksConfig<Datum>
  implements VicDataMarksOptions<Datum>
{
  x: VicDateDimension<Datum>;
  y: VicQuantitativeDimension<Datum>;
  categorical: VicCategoricalDimension<Datum, TCategoricalValue>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueIsDefined?: (d: Datum, i: number, ...args: any) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  curve: (x: any) => any;
  stackOffset: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stackOrder: (x: any) => any;
  categoricalOrder?: TCategoricalValue[];
  series: (SeriesPoint<[Date, InternMap<TCategoricalValue, number>]> & {
    i: number;
  })[][];

  constructor(init?: Partial<VicStackedAreaConfig<Datum, TCategoricalValue>>) {
    super();
    Object.assign(this, init);
    this.curve = this.curve ?? DEFAULT.curve;
    this.stackOffset = this.stackOffset ?? DEFAULT.stackOffset;
    this.stackOrder = this.stackOrder ?? DEFAULT.stackOrder;
  }

  setPropertiesFromData(): void {
    this.setDimensionPropertiesFromData();
    this.setValueIndicies();
    this.setSeries();
    this.initQuantitativeDomainFromStack();
  }

  setDimensionPropertiesFromData(): void {
    this.x.setPropertiesFromData(this.data);
    this.y.setPropertiesFromData(this.data);
    this.categorical.setPropertiesFromData(this.data);
  }

  setValueIndicies(): void {
    this.valueIndicies = range(this.x.values.length).filter((i) =>
      this.categorical.domainIncludes(this.categorical.values[i])
    );
  }

  setSeries(): void {
    const rolledUpData = rollup(
      this.valueIndicies,
      ([i]) => i,
      (i) => this.x.values[i],
      (i) => this.categorical.values[i]
    );

    const keys = this.categoricalOrder
      ? this.categoricalOrder.slice().reverse()
      : this.categorical.domain;

    this.series = stack<
      [Date, InternMap<TCategoricalValue, number>],
      TCategoricalValue
    >()
      .keys(keys)
      .value(([, I], category) => this.y.values[I.get(category)])
      .order(this.stackOrder)
      .offset(this.stackOffset)(Array.from(rolledUpData))
      .map((s) =>
        s.map((d) =>
          Object.assign(d, {
            i: d.data[1].get(s.key),
          })
        )
      );
  }

  initQuantitativeDomainFromStack(): void {
    if (this.y.domain === undefined) {
      this.y.setUnpaddedDomain(extent(this.series.flat(2)));
    }
  }
}

export function vicStackedArea<Datum, TCategoricalValue extends VicDataValue>(
  options: Partial<VicStackedAreaConfig<Datum, TCategoricalValue>>
): VicStackedAreaConfig<Datum, TCategoricalValue> {
  const config = new VicStackedAreaConfig(options);
  config.categorical.range =
    config.categorical.range ?? DEFAULT.categorical.range;
  config.setPropertiesFromData();
  return config;
}
