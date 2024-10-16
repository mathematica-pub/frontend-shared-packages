import { FillDef } from '../../../data-dimensions';

export interface AreaFillsOptions<Datum> {
  color: (d: Datum) => string;
  display: boolean;
  fillDefs: FillDef<Datum>[];
  opacity: number;
}
