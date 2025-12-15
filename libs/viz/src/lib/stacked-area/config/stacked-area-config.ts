import { safeAssign } from '@mathstack/app-kit';
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
import { DateChartPositionDimension } from '../../data-dimensions/continuous-quantitative/date-chart-position/date-chart-position';
import { NumberChartPositionDimension } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { DataMarksOptions } from '../../marks/config/marks-options';
import { XyPrimaryMarksConfig } from '../../marks/xy-marks/xy-primary-marks/xy-primary-marks-config';
import { StackedAreaOptions } from './stacked-area-options';

export type StackedAreaDatum<CategoricalDomain> = (SeriesPoint<
  [ContinuousValue, InternMap<CategoricalDomain, number>]
> & {
  i: number;
})[];

export class StackedAreaConfig<Datum, CategoricalDomain extends DataValue>
  extends XyPrimaryMarksConfig<Datum>
  implements DataMarksOptions<Datum>
{
  color: OrdinalVisualValueDimension<Datum, CategoricalDomain, string>;
  categoricalOrder: CategoricalDomain[];
  curve: CurveFactory;
  stackOrder: (
    series: Series<
      [ContinuousValue, InternMap<CategoricalDomain, number>],
      CategoricalDomain
    >
  ) => Iterable<number>;
  stackOffset: (
    series: Series<
      [ContinuousValue, InternMap<CategoricalDomain, number>],
      CategoricalDomain
    >,
    order: number[]
  ) => void;
  x: DateChartPositionDimension<Datum> | NumberChartPositionDimension<Datum>;
  y: NumberChartPositionDimension<Datum>;
  series: StackedAreaDatum<CategoricalDomain>[];

  constructor(options: StackedAreaOptions<Datum, CategoricalDomain>) {
    super();
    safeAssign(this, options);
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
    this.color.setPropertiesFromData(this.data);
  }

  private setValueIndicies(): void {
    this.valueIndices = range(this.x.values.length).filter((i) =>
      this.color.domainIncludes(this.color.values[i])
    );
  }

  private setSeries(): void {
    const rolledUpData = rollup(
      this.valueIndices,
      ([i]) => i,
      (i) => this.x.values[i],
      (i) => this.color.values[i]
    );

    const keys = this.categoricalOrder
      ? this.categoricalOrder.slice().reverse()
      : this.color.calculatedDomain;

    this.series = stack<
      [ContinuousValue, InternMap<CategoricalDomain, number>],
      CategoricalDomain
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
