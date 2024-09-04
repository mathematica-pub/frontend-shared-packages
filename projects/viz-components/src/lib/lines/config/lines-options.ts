import { CurveFactory } from 'd3';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { QuantitativeDateDimension } from '../../data-dimensions/quantitative/quantitative-date';
import { QuantitativeNumericDimension } from '../../data-dimensions/quantitative/quantitative-numeric';
import { DataMarksOptions } from '../../data-marks/config/data-marks-options';
import { PointMarkers } from '../../marks/point-markers/point-markers';
import { Stroke } from '../../marks/stroke/stroke';
import { BelowLinesAreaFill } from './below-lines-area-fill/below-lines-area-fill';

export interface LinesOptions<Datum> extends DataMarksOptions<Datum> {
  categorical: CategoricalDimension<Datum, string>;
  curve: CurveFactory;
  hoverDot: PointMarkers;
  labelLines: boolean;
  lineLabelsFormat: (d: string) => string;
  pointerDetectionRadius: number;
  pointMarkers: PointMarkers;
  stroke: Stroke;
  x: QuantitativeDateDimension<Datum> | QuantitativeNumericDimension<Datum>;
  y: QuantitativeNumericDimension<Datum>;
  belowLinesAreaFill: BelowLinesAreaFill;
}
