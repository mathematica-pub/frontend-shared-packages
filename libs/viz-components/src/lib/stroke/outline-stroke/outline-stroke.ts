import { Stroke } from '../stroke';
import { OutlineStrokeOptions } from './outline-stroke-options';

export class OutlineStroke extends Stroke implements OutlineStrokeOptions {
  readonly color: string;

  constructor(options: Partial<OutlineStrokeOptions>) {
    super(options);
    Object.assign(this, options);
  }
}
