import { LinesFillOptions as BelowLinesAreaFillOptions } from './below-lines-area-fill-options';

export class BelowLinesAreaFill {
  readonly display: boolean;
  readonly opacity: number;
  readonly gradient: string;

  constructor(options: BelowLinesAreaFillOptions) {
    Object.assign(this, options);
  }
}
