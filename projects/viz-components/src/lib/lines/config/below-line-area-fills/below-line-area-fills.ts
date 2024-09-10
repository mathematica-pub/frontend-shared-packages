import { FillDef } from '../../../data-dimensions';
import { BelowLineAreaFillsOptions } from './below-line-area-fills-options';

export class BelowLineAreaFills<Datum> {
  readonly display: boolean;
  readonly opacity: number;
  readonly fillDefs: FillDef<Datum>[];

  constructor(options: BelowLineAreaFillsOptions) {
    Object.assign(this, options);
  }
}
