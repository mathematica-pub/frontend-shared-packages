import { safeAssign } from '@hsi/app-dev-kit';
import { ElementSpacing } from '../../../core/types/layout';
import { ScalingStrategy } from './chart-builder';
import { ChartOptions } from './chart-options';

export class ChartConfig implements ChartOptions {
  aspectRatio: number;
  height: number;
  margin: ElementSpacing;
  scalingStrategy: ScalingStrategy;
  transitionDuration: number;
  width: number;

  constructor(config: ChartConfig) {
    safeAssign(this, config);
  }
}
