import { CurveFactory, InternMap, Series } from 'd3';
import { ContinuousValue, DataValue } from '../../core/types/values';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { DateChartPositionDimension } from '../../data-dimensions/quantitative/date-chart-position/date-chart-position';
import { QuantitativeNumericDimension } from '../../data-dimensions/quantitative/quantitative-numeric';
import { MarksOptions } from '../../marks/config/marks-options';

export interface StackedAreaOptions<Datum, TCategoricalValue extends DataValue>
  extends MarksOptions<Datum>,
    MarksOptions<Datum> {
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
  x: DateChartPositionDimension<Datum> | QuantitativeNumericDimension<Datum>;
  y: QuantitativeNumericDimension<Datum>;
}
