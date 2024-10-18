import { StrokeOptions } from '../stroke-options';

export interface OutlineStrokeOptions extends Omit<StrokeOptions, 'opacity'> {
  color: string;
}
