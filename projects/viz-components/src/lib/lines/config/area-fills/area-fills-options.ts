import { FillDef } from '../../../data-dimensions';

export interface AreaFillsOptions<Datum> {
  display: boolean;
  opacity: number;
  fillDefs: FillDef<Datum>[];
  color: (d: Datum) => string;
}
