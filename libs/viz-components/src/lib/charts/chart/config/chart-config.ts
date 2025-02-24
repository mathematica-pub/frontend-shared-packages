import { ElementSpacing } from '../../../core/types/layout';
import { ChartResizing } from '../chart.component';
import { ChartOptions } from './chart-options';

export class ChartConfig implements ChartOptions {
  aspectRatio: number;
  height: number;
  margin: ElementSpacing;
  resize: ChartResizing;
  transitionDuration: number;
  width: number;

  constructor(config: ChartOptions) {
    Object.assign(this, config);
  }
}
