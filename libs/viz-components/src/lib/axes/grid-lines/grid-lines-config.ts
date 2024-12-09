import { Stroke } from '../../stroke';
import { GridLinesOptions } from './grid-lines-options';

export class GridLines implements GridLinesOptions {
  color: (i: number) => string;
  display: (i: number) => boolean;
  stroke: Stroke;

  constructor(options: GridLinesOptions) {
    Object.assign(this, options);
  }
}
