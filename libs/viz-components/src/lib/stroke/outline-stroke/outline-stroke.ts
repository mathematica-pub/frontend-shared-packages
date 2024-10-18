import { Stroke } from '../stroke';
import { OutlineStrokeOptions } from './outline-stroke-options';

export class OutlineStroke
  extends Omit<Stroke, 'opacity'>
  implements OutlineStrokeOptions
{
  readonly color: string;
  dasharray: string;
  linecap: string;
  linejoin: string;
  width: number;

  constructor(options: Partial<OutlineStrokeOptions>) {
    super(options);
    Object.assign(this, options);
  }
}
