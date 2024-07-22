import { CurveFactory, InternMap, Series } from 'd3';
import { ContinuousValue, DataValue } from '../../core/types/values';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { QuantitativeDateDimension } from '../../data-dimensions/quantitative/quantitative-date';
import { QuantitativeNumericDimension } from '../../data-dimensions/quantitative/quantitative-numeric';
import { DataMarksOptions } from '../../data-marks/config/data-marks-options';

export interface StackedAreaOptions<Datum, TCategoricalValue extends DataValue>
  extends DataMarksOptions<Datum>,
    DataMarksOptions<Datum> {
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
}
