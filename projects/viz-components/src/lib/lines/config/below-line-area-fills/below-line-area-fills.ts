import { BelowLineAreaFillsOptions } from './below-line-area-fills-options';

export class BelowLineAreaFills {
  readonly display: boolean;
  readonly opacity: number;
  readonly gradient: string;

  constructor(options: BelowLineAreaFillsOptions) {
    Object.assign(this, options);
  }
}
