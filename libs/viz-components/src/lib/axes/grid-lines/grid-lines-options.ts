import { Stroke } from '../../stroke';

export interface GridLinesOptions {
  color: (i: number) => string;
  filter: (i: number) => boolean;
  stroke: Stroke;
  axis: 'x' | 'y';
}
