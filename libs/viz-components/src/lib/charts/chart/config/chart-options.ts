import { ElementSpacing } from '../../../core/types/layout';
import { ChartResizing } from '../chart.component';

export interface ChartOptions {
  aspectRatio: number;
  height: number;
  margin: ElementSpacing;
  resize: ChartResizing;
  transitionDuration: number;
  width: number;
}
