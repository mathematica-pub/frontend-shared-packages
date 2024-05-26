import {
  CurveFactory,
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
import { VicContinuousValue, VicDataValue } from '../../core/types/values';
import { VicCategoricalDimension } from '../../data-dimensions/categorical-dimension';
import { VicDateDimension } from '../../data-dimensions/date-dimension';
import { VicQuantitativeDimension } from '../../data-dimensions/quantitative-dimension';
import { VicDataMarksOptions } from '../../data-marks/data-marks-types';
import { VicXyDataMarksConfig } from '../../xy-data-marks/xy-data-marks-config';

const DEFAULT = {
  curve: curveLinear,
  stackOrder: stackOrderNone,
  stackOffset: stackOffsetNone,
  categorical: {
    range: schemeTableau10 as string[],
  },
};

export interface VicStackedAreaOptions<
  Datum,
  TCategoricalValue extends VicDataValue
> extends VicDataMarksOptions<Datum>,
    VicDataMarksOptions<Datum> {
  x: VicDateDimension<Datum> | VicQuantitativeDimension<Datum>;
  y: VicQuantitativeDimension<Datum>;
  categorical: VicCategoricalDimension<Datum, TCategoricalValue>;
  curve: CurveFactory;
  stackOffset: (
    series: Series<
      [VicContinuousValue, InternMap<TCategoricalValue, number>],
      TCategoricalValue
    >,
    order: number[]
  ) => void;
  stackOrder: (
    series: Series<
      [VicContinuousValue, InternMap<TCategoricalValue, number>],
      TCategoricalValue
    >
  ) => Iterable<number>;
  categoricalOrder: TCategoricalValue[];
}

export class VicStackedAreaConfig<Datum, TCategoricalValue extends VicDataValue>
  extends VicXyDataMarksConfig<Datum>
  implements VicDataMarksOptions<Datum>
{
  x: VicDateDimension<Datum> | VicQuantitativeDimension<Datum>;
  y: VicQuantitativeDimension<Datum>;
  categorical: VicCategoricalDimension<Datum, TCategoricalValue>;
  curve: CurveFactory;
  stackOffset: (
    series: Series<
      [VicContinuousValue, InternMap<TCategoricalValue, number>],
      TCategoricalValue
    >,
    order: number[]
  ) => void;
  stackOrder: (
    series: Series<
      [VicContinuousValue, InternMap<TCategoricalValue, number>],
      TCategoricalValue
    >
  ) => Iterable<number>;
  categoricalOrder: TCategoricalValue[];
  series: (SeriesPoint<
    [VicContinuousValue, InternMap<TCategoricalValue, number>]
  > & {
    i: number;
  })[][];

  constructor(
    options?: Partial<VicStackedAreaOptions<Datum, TCategoricalValue>>
  ) {
    super();
    Object.assign(this, options);
    this.curve = this.curve ?? DEFAULT.curve;
    this.stackOffset = this.stackOffset ?? DEFAULT.stackOffset;
    this.stackOrder = this.stackOrder ?? DEFAULT.stackOrder;
    this.initPropertiesFromData();
  }

  protected initPropertiesFromData(): void {
    this.setDimensionPropertiesFromData();
    this.setValueIndicies();
    this.setSeries();
    this.initQuantitativeDomainFromStack();
  }

  private setDimensionPropertiesFromData(): void {
    this.x.setPropertiesFromData(this.data);
    this.y.setPropertiesFromData(this.data);
    this.categorical.setPropertiesFromData(this.data);
  }

  private setValueIndicies(): void {
    this.valueIndicies = range(this.x.values.length).filter((i) =>
      this.categorical.domainIncludes(this.categorical.values[i])
    );
  }

  private setSeries(): void {
    const rolledUpData = rollup(
      this.valueIndicies,
      ([i]) => i,
      (i) => this.x.values[i],
      (i) => this.categorical.values[i]
    );

    const keys = this.categoricalOrder
      ? this.categoricalOrder.slice().reverse()
      : this.categorical.calculatedDomain;

    this.series = stack<
      [VicContinuousValue, InternMap<TCategoricalValue, number>],
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

  private initQuantitativeDomainFromStack(): void {
    if (this.y.domain === undefined) {
      this.y.setDomain(extent(this.series.flat(2)));
    }
  }
}

export function vicStackedArea<Datum, TCategoricalValue extends VicDataValue>(
  options: Partial<VicStackedAreaOptions<Datum, TCategoricalValue>>
): VicStackedAreaConfig<Datum, TCategoricalValue> {
  return new VicStackedAreaConfig(options);
}
