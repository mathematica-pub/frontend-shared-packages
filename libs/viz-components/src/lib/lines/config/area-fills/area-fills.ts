import { FillDefinition } from '../../../data-dimensions';
import { AreaFillsOptions } from './area-fills-options';

export class AreaFills<Datum> implements AreaFillsOptions<Datum> {
  readonly display: boolean;
  readonly opacity: number;
  readonly customFills: FillDefinition<Datum>[];
  readonly color: (d: Datum) => string;

  constructor(options: AreaFillsOptions<Datum>) {
    Object.assign(this, options);
  }
}
