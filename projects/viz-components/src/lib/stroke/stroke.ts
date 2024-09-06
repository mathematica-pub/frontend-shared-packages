import { StrokeOptions } from './stroke-options';

export class Stroke implements StrokeOptions {
  readonly linecap: string;
  readonly linejoin: string;
  readonly opacity: number;
  readonly width: number;

  constructor(options?: Partial<StrokeOptions>) {
    Object.assign(this, options);
  }
}
