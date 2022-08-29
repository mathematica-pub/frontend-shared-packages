import { Ranges } from '../chart/chart.component';
import { DataMarksConfig } from './data-marks.config';

export class DataMarks {
  config: DataMarksConfig;
  ranges: Ranges;
  setMethodsFromConfigAndDraw: () => void;
  resizeMarks: () => void;
  drawMarks: (transitionDuration: number) => void;
  onPointerEnter: (event: PointerEvent) => void;
  onPointerLeave: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
}
