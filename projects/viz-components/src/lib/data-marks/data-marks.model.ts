import { Ranges } from '../chart/chart.model';

export class DataMarks {
  config: DataMarksConfig = new DataMarksConfig();
  ranges: Ranges;
  setMethodsFromConfigAndDraw: () => void;
  resizeMarks: () => void;
  drawMarks: (transitionDuration: number) => void;
  onPointerEnter: (event: PointerEvent) => void;
  onPointerLeave: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
  constructor(init?: Partial<DataMarks>) {
    Object.assign(this, init);
  }
}

export class DataMarksConfig {
  data: any[];
  mixBlendMode: string;
  tooltip: TooltipConfig;

  constructor(init?: Partial<DataMarksConfig>) {
    this.mixBlendMode = 'normal';
    this.tooltip = new TooltipConfig();
    Object.assign(this, init);
  }
}

export class TooltipConfig {
  show: boolean;
  type: 'svg' | 'html';

  constructor(init?: Partial<TooltipConfig>) {
    this.show = false;
    this.type = 'svg';
    Object.assign(this, init);
  }
}
