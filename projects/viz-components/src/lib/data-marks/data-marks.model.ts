export class DataMarks {
  config: DataMarksConfig;
  setMethodsFromConfigAndDraw: () => void;
  resizeMarks: () => void;
  drawMarks: (transitionDuration: number) => void;
  onPointerEnter: (event: PointerEvent) => void;
  onPointerLeave: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
}

export class DataMarksConfig {
  data: any[];
  transitionDuration: number;
  mixBlendMode: string;
  showTooltip?: boolean;

  constructor() {
    this.transitionDuration = 250;
    this.mixBlendMode = 'normal';
  }
}
