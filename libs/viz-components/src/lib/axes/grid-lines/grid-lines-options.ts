import { Stroke } from '../../stroke';

export interface GridLinesOptions {
  filter: (i: number) => boolean;
  stroke: Stroke;
  axis: 'x' | 'y';
}
