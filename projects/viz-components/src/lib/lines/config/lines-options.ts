import { CurveFactory } from 'd3';
import { VicDimensionCategorical } from '../../data-dimensions/categorical/categorical';
import { VicDimensionQuantitativeDate } from '../../data-dimensions/quantitative/quantitative-date';
import { VicDimensionQuantitativeNumeric } from '../../data-dimensions/quantitative/quantitative-numeric';
import { VicDataMarksOptions } from '../../data-marks/config/data-marks-options';
import { VicPointMarkers } from '../../marks/point-markers/point-markers';
import { VicStroke } from '../../marks/stroke/stroke';

export interface VicLinesOptions<Datum> extends VicDataMarksOptions<Datum> {
  categorical: VicDimensionCategorical<Datum, string>;
  curve: CurveFactory;
  hoverDot: VicPointMarkers;
  labelLines: boolean;
  lineLabelsFormat: (d: string) => string;
  pointerDetectionRadius: number;
  pointMarkers: VicPointMarkers;
  stroke: VicStroke;
  x:
    | VicDimensionQuantitativeDate<Datum>
    | VicDimensionQuantitativeNumeric<Datum>;
  y: VicDimensionQuantitativeNumeric<Datum>;
}
