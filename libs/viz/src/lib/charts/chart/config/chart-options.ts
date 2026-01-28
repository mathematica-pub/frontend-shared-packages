import { ElementSpacing } from '../../../core/types/layout';
import { ScalingStrategy } from './chart-builder';

export interface ChartOptions {
  aspectRatio?: number;
  height: number;
  margin: ElementSpacing;
  scalingStrategy: ScalingStrategy;
  transitionDuration: number;
  width: number;
}
