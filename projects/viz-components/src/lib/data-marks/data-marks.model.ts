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
}

export class DataMarksConfig {
  data: any[];
  mixBlendMode: string;
  showTooltip?: boolean;

  constructor() {
    this.mixBlendMode = 'normal';
    this.showTooltip = false;
  }
}
