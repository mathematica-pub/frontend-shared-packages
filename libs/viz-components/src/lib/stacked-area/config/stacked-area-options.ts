import { CurveFactory, InternMap, Series } from 'd3';
import { ContinuousValue, DataValue } from '../../core/types/values';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { DateChartPositionDimension } from '../../data-dimensions/quantitative/date-chart-position/date-chart-position';
import { NumberChartPositionDimension } from '../../data-dimensions/quantitative/number-chart-position/number-chart-position';
import { MarksOptions } from '../../marks/config/marks-options';

export interface StackedAreaOptions<Datum, TCategoricalValue extends DataValue>
  extends MarksOptions<Datum>,
    MarksOptions<Datum> {
  categorical: OrdinalVisualValueDimension<Datum, TCategoricalValue>;
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
  x: DateChartPositionDimension<Datum> | NumberChartPositionDimension<Datum>;
  y: NumberChartPositionDimension<Datum>;
}
