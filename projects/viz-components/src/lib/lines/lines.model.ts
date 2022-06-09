import { curveLinear, scaleLinear, scaleUtc, schemeTableau10 } from 'd3';
import {
  CategoricalColorDimension,
  QuantitativeDimension,
} from '../data-marks/data-dimension.model';
import { DataMarksConfig } from '../data-marks/data-marks.model';

export class LinesConfig extends DataMarksConfig {
  x: QuantitativeDimension = new QuantitativeDimension();
  y: QuantitativeDimension = new QuantitativeDimension();
  category: CategoricalColorDimension = new CategoricalColorDimension();
  valueIsDefined?: (...args: any) => any;
  curve: (x: any) => any;
  pointMarker?: PointMarker = new PointMarker();
  stroke?: LinesStroke = new LinesStroke();
  labelLines?: boolean;
  tooltipDetectionRadius?: number;
  lineLabelsFormat?: (d: string) => string;

  constructor() {
    super();
    this.x.valueAccessor = ([x]) => x;
    this.x.scaleType = scaleUtc;
    this.y.valueAccessor = ([, y]) => y;
    this.y.scaleType = scaleLinear;
    this.category.valueAccessor = () => 1;
    this.category.colors = schemeTableau10 as string[];
    this.curve = curveLinear;
    this.stroke.width = 2;
    this.lineLabelsFormat = (d: string) => d;
  }
}

export class LinesStroke {
  linecap?: string;
  linejoin?: string;
  width?: number;
  opacity?: number;
}

export class PointMarker {
  radius: number;
}

export class LinesTooltipData {
  datum: any;
  color: string;
  x: string;
  y: string;
  category: string;
}
