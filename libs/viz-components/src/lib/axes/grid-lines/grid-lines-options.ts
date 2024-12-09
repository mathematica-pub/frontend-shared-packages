import { Stroke } from '../../stroke';

export interface GridLinesOptions {
  color: (i: number) => string;
  display: (i: number) => boolean;
  stroke: Stroke;
}
