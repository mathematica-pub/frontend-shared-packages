import { MarksOptions } from './marks-options';

export abstract class MarksConfig<Datum> implements MarksOptions<Datum> {
  readonly data: Datum[];
  readonly mixBlendMode: string;

  constructor() {
    this.mixBlendMode = 'normal';
  }
}
