import { CurveFactory } from 'd3';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { QuantitativeDateDimension } from '../../data-dimensions/quantitative/quantitative-date';
import { QuantitativeNumericDimension } from '../../data-dimensions/quantitative/quantitative-numeric';
import { DataMarksOptions } from '../../data-marks/config/data-marks-options';
import { VicPointMarkers } from '../../marks/point-markers/point-markers';
import { Stroke } from '../../marks/stroke/stroke';

export interface LinesOptions<Datum> extends DataMarksOptions<Datum> {
  categorical: CategoricalDimension<Datum, string>;
  curve: CurveFactory;
  hoverDot: VicPointMarkers;
  labelLines: boolean;
  lineLabelsFormat: (d: string) => string;
  pointerDetectionRadius: number;
  pointMarkers: VicPointMarkers;
  stroke: Stroke;
  x: QuantitativeDateDimension<Datum> | QuantitativeNumericDimension<Datum>;
  y: QuantitativeNumericDimension<Datum>;
}
