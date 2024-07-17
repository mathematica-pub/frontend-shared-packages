import { VicStrokeOptions } from './stroke-options';

export class VicStroke implements VicStrokeOptions {
  readonly linecap: string;
  readonly linejoin: string;
  readonly opacity: number;
  readonly width: number;

  constructor(options?: Partial<VicStrokeOptions>) {
    Object.assign(this, options);
  }
}
