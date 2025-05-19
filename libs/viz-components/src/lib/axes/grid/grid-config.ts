import { safeAssign } from '@hsi/app-dev-kit';
import { Stroke } from '../../stroke';
import { GridOptions } from './grid-options';

export class Grid implements GridOptions {
  axis: 'x' | 'y';
  filter: (i: number) => boolean;
  stroke: Stroke;

  constructor(options: GridOptions) {
    safeAssign(this, options);
  }
}
