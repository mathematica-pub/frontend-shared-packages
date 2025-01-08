import { Stroke } from '../../stroke';
import { GridLinesOptions } from './grid-lines-options';

export class GridLines implements GridLinesOptions {
  filter: (i: number) => boolean;
  stroke: Stroke;
  axis: 'x' | 'y';

  constructor(options: GridLinesOptions) {
    Object.assign(this, options);
  }
}
