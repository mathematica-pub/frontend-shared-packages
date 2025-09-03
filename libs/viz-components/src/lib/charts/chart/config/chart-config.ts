import { safeAssign } from '@hsi/app-dev-kit';
import { ElementSpacing } from '../../../core/types/layout';
import { ScalingStrategy } from './chart-builder';
import { ChartOptions } from './chart-options';

export class ChartConfig implements ChartOptions {
  aspectRatio?: number;
  height: number | null;
  isFixedHeight: boolean;
  margin: ElementSpacing;
  minWidth: number | null;
  scalingStrategy: ScalingStrategy;
  transitionDuration: number;
  width: number | null;
  viewBoxX: number;
  viewBoxY: number;

  constructor(config: ChartConfig) {
    safeAssign(this, config);
  }
}
