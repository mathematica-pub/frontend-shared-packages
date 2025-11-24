import { FillDefinition } from '../../../data-dimensions';

export interface AreaFillsOptions<Datum> {
  display: (category: string) => boolean;
  opacity: number;
  customFills: FillDefinition<Datum>[];
  color: (d: Datum) => string;
}
