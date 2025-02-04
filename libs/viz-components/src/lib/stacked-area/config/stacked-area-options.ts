import { CurveFactory, InternMap, Series } from 'd3';
import { ContinuousValue, DataValue } from '../../core/types/values';
import { DateChartPositionDimension } from '../../data-dimensions/continuous-quantitative/date-chart-position/date-chart-position';
import { NumberChartPositionDimension } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { DataMarksOptions } from '../../marks/config/marks-options';

export interface StackedAreaOptions<Datum, CategoricalDomain extends DataValue>
  extends DataMarksOptions<Datum>,
    DataMarksOptions<Datum> {
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
}
