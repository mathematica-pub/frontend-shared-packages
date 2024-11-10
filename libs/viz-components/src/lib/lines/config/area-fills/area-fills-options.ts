import { FillDefinition } from '../../../fill-definition/fill-definition';

export interface AreaFillsOptions<Datum> {
  display: boolean;
  opacity: number;
  customFills: FillDefinition<Datum>[];
  color: (d: Datum) => string;
}
