import { ElementSpacing } from '../../../core/types/layout';
import { ChartScaling } from '../chart.component';

export class ChartConfig {
  aspectRatio: number;
  height: number;
  margin: ElementSpacing;
  scaleChartWithContainerWidth: ChartScaling;
  transitionDuration: number;
  width: number;

  constructor(config: ChartConfig) {
    Object.assign(this, config);
  }
}
