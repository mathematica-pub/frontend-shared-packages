import { StrokeOptions } from './stroke-options';

export class Stroke implements StrokeOptions {
  readonly color: string;
  readonly linecap: string;
  readonly linejoin: string;
  readonly opacity: number;
  readonly width: number;
  readonly dasharray: string;

  constructor(options: Partial<StrokeOptions>) {
    Object.assign(this, options);
  }
}
