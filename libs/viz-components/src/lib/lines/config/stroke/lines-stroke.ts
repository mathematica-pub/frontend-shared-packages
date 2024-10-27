import { LinesStrokeOptions } from './lines-stroke-options';

export class LinesStroke implements LinesStrokeOptions {
  readonly dasharray: string;
  readonly linecap: string;
  readonly linejoin: string;
  readonly opacity: number;
  readonly width: number;

  constructor(options: Partial<LinesStrokeOptions>) {
    Object.assign(this, options);
  }
}
