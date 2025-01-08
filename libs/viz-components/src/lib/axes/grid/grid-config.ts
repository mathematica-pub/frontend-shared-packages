import { Stroke } from '../../stroke';
import { GridOptions } from './grid-options';

export class Grid implements GridOptions {
  filter: (i: number) => boolean;
  stroke: Stroke;
  axis: 'x' | 'y';

  constructor(options: GridOptions) {
    Object.assign(this, options);
  }
}
