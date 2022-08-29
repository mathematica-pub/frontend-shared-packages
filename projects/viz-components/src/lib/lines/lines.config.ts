import { curveLinear, scaleLinear, scaleUtc, schemeTableau10 } from 'd3';
import {
  CategoricalColorDimensionConfig,
  QuantitativeDimensionConfig,
} from '../data-marks/data-dimension.config';
import {
  DataMarksConfig,
  TooltipConfig,
} from '../data-marks/data-marks.config';

export class LinesConfig extends DataMarksConfig {
  x: QuantitativeDimensionConfig = new QuantitativeDimensionConfig();
  y: QuantitativeDimensionConfig = new QuantitativeDimensionConfig();
  category: CategoricalColorDimensionConfig =
    new CategoricalColorDimensionConfig();
  valueIsDefined?: (...args: any) => any;
  curve: (x: any) => any;
  pointMarker: PointMarkerConfig = new PointMarkerConfig();
  stroke?: LinesStrokeConfig = new LinesStrokeConfig();
  labelLines?: boolean;
  override tooltip: LinesTooltipConfig;
  lineLabelsFormat?: (d: string) => string;

  constructor(init?: Partial<LinesConfig>) {
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
    this.tooltip = new LinesTooltipConfig();
    Object.assign(this, init);
  }
}

export class LinesTooltipConfig extends TooltipConfig {
  detectionRadius: number;

  constructor(init?: Partial<LinesTooltipConfig>) {
    super();
    this.detectionRadius = 80;
    Object.assign(this, init);
  }
}

export class LinesStrokeConfig {
  linecap?: string;
  linejoin?: string;
  width?: number;
  opacity?: number;
  constructor(init?: Partial<LinesStrokeConfig>) {
    Object.assign(this, init);
  }
}

export class PointMarkerConfig {
  display: boolean;
  radius: number;
  growByOnHover: number;

  constructor(init?: Partial<PointMarkerConfig>) {
    this.display = true;
    this.radius = 3;
    this.growByOnHover = 1;
    Object.assign(this, init);
  }
}
export class LinesEmittedData {
  datum: any;
  color: string;
  x: string;
  y: string;
  category: string;
  positionX?: number;
  positionY?: number;
}
