import { CurveFactory, InternMap, Series } from 'd3';
import {
  VicContinuousValue,
  VicDataValue,
  VicDimensionCategorical,
  VicDimensionQuantitativeDate,
  VicDimensionQuantitativeNumeric,
} from 'projects/viz-components/src/public-api';
import { VicDataMarksOptions } from '../../data-marks/config/data-marks-options';

export interface VicStackedAreaOptions<
  Datum,
  TCategoricalValue extends VicDataValue
> extends VicDataMarksOptions<Datum>,
    VicDataMarksOptions<Datum> {
  categorical: VicDimensionCategorical<Datum, TCategoricalValue>;
  categoricalOrder: TCategoricalValue[];
  curve: CurveFactory;
  stackOrder: (
    series: Series<
      [VicContinuousValue, InternMap<TCategoricalValue, number>],
      TCategoricalValue
    >
  ) => Iterable<number>;
  stackOffset: (
    series: Series<
      [VicContinuousValue, InternMap<TCategoricalValue, number>],
      TCategoricalValue
    >,
    order: number[]
  ) => void;
  x:
    | VicDimensionQuantitativeDate<Datum>
    | VicDimensionQuantitativeNumeric<Datum>;
  y: VicDimensionQuantitativeNumeric<Datum>;
}
