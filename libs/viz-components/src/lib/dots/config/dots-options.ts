import { QuantitativeNumericDimension } from '../../data-dimensions/quantitative/quantitative-numeric';
import { MarksOptions } from '../../marks/config/marks-options';
import { Stroke } from '../../stroke/stroke';

export interface DotsOptions<Datum> extends MarksOptions<Datum> {
  fill: string;
  pointerDetectionRadius: number;
  radius: number;
  stroke: Stroke;
  x: QuantitativeNumericDimension<Datum>;
  y: QuantitativeNumericDimension<Datum>;
}
