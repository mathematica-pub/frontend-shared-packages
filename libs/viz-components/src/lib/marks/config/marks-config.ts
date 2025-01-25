import { MarksOptions } from './marks-options';

export abstract class MarksConfig<Datum> implements MarksOptions<Datum> {
  readonly class: string;
  readonly data: Datum[];
  readonly mixBlendMode: string;
}
