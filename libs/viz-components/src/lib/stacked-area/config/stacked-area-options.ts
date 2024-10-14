import { CurveFactory, InternMap, Series } from 'd3';
import { ContinuousValue, DataValue } from '../../core/types/values';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { DateNumberDimension } from '../../data-dimensions/quantitative/date-number/date-number';
import { NumberChartPositionDimension } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position';
import { MarksOptions } from '../../marks/config/marks-options';

export interface StackedAreaOptions<Datum, CategoricalDomain extends DataValue>
  extends MarksOptions<Datum>,
    MarksOptions<Datum> {
  categorical: CategoricalDimension<Datum, CategoricalDomain, string>;
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
  x: DateNumberDimension<Datum> | NumberChartPositionDimension<Datum>;
  y: NumberChartPositionDimension<Datum>;
}
