import { curveLinear, scaleLinear, scaleUtc, schemeTableau10 } from 'd3';
import {
  CategoricalColorDimension,
  QuantitativeDimension,
} from '../data-marks/data-dimension.model';
import { DataMarksConfig, TooltipConfig } from '../data-marks/data-marks.model';

export class LinesConfig extends DataMarksConfig {
  x: QuantitativeDimension = new QuantitativeDimension();
  y: QuantitativeDimension = new QuantitativeDimension();
  category: CategoricalColorDimension = new CategoricalColorDimension();
  valueIsDefined?: (...args: any) => any;
  curve: (x: any) => any;
  pointMarker: PointMarker = new PointMarker();
  stroke?: LinesStroke = new LinesStroke();
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

export class LinesStroke {
  linecap?: string;
  linejoin?: string;
  width?: number;
  opacity?: number;
  constructor(init?: Partial<LinesStroke>) {
    Object.assign(this, init);
  }
}

export class PointMarker {
  display: boolean;
  radius: number;
  growByOnHover: number;

  constructor(init?: Partial<PointMarker>) {
    this.display = true;
    this.radius = 3;
    this.growByOnHover = 1;
    Object.assign(this, init);
  }
}

export class LinesTooltipData {
  datum: any;
  color: string;
  x: string;
  y: string;
  category: string;
  constructor(init?: Partial<LinesTooltipData>) {
    Object.assign(this, init);
  }
}

export interface Marker {
  key: string;
  index: number;
}
