import { FillDefinition } from '../../../data-dimensions';

export interface AreaFillsOptions<Datum> {
  display: boolean;
  opacity: number;
  customFills: FillDefinition<Datum>[];
  color: (d: Datum) => string;
}
