import { Stroke } from '../../stroke';

export interface GridOptions {
  filter: (i: number) => boolean;
  stroke: Stroke;
  axis: 'x' | 'y';
}
