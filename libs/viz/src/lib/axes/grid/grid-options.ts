import { Stroke } from '../../stroke';

export interface GridOptions {
  axis: 'x' | 'y';
  filter: (i: number) => boolean;
  stroke: Stroke;
}
