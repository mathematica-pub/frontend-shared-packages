import {
  CurveFactory,
  extent,
  InternMap,
  range,
  rollup,
  Series,
  SeriesPoint,
  stack,
} from 'd3';
import { ContinuousValue, DataValue } from '../../core/types/values';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { QuantitativeDateDimension } from '../../data-dimensions/quantitative/quantitative-date';
import { QuantitativeNumericDimension } from '../../data-dimensions/quantitative/quantitative-numeric';
import { MarksOptions } from '../../marks/config/marks-options';
import { XyPrimaryMarksConfig } from '../../xy-marks/xy-primary-marks/xy-primary-marks-config';
import { StackedAreaOptions } from './stacked-area-options';

export class StackedAreaConfig<Datum, TCategoricalValue extends DataValue>
  extends XyPrimaryMarksConfig<Datum>
  implements MarksOptions<Datum>
{
  categorical: CategoricalDimension<Datum, TCategoricalValue>;
  categoricalOrder: TCategoricalValue[];
  curve: CurveFactory;
  stackOrder: (
    series: Series<
      [ContinuousValue, InternMap<TCategoricalValue, number>],
      TCategoricalValue
    >
  ) => Iterable<number>;
  stackOffset: (
    series: Series<
      [ContinuousValue, InternMap<TCategoricalValue, number>],
      TCategoricalValue
    >,
    order: number[]
  ) => void;
  x: QuantitativeDateDimension<Datum> | QuantitativeNumericDimension<Datum>;
  y: QuantitativeNumericDimension<Datum>;
  series: (SeriesPoint<
    [ContinuousValue, InternMap<TCategoricalValue, number>]
  > & {
    i: number;
  })[][];

  constructor(options: StackedAreaOptions<Datum, TCategoricalValue>) {
    super();
    Object.assign(this, options);
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
    this.valueIndices = range(this.x.values.length).filter((i) =>
      this.categorical.domainIncludes(this.categorical.values[i])
    );
  }

  private setSeries(): void {
    const rolledUpData = rollup(
      this.valueIndices,
      ([i]) => i,
      (i) => this.x.values[i],
      (i) => this.categorical.values[i]
    );

    const keys = this.categoricalOrder
      ? this.categoricalOrder.slice().reverse()
      : this.categorical.calculatedDomain;

    this.series = stack<
      [ContinuousValue, InternMap<TCategoricalValue, number>],
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
