import { CurveFactory } from 'd3';
import { CategoricalDimension } from '../../data-dimensions/categorical/categorical';
import { QuantitativeDateDimension } from '../../data-dimensions/quantitative/quantitative-date';
import { QuantitativeNumericDimension } from '../../data-dimensions/quantitative/quantitative-numeric';
import { DataMarksOptions } from '../../data-marks/config/data-marks-options';
import { PointMarkers } from '../../point-markers/point-markers';
import { Stroke } from '../../stroke/stroke';
import { BelowLineAreaFills } from './below-line-area-fills/below-line-area-fills';

export interface LinesOptions<Datum> extends DataMarksOptions<Datum> {
  belowLineAreaFills: BelowLineAreaFills<Datum>;
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
}
