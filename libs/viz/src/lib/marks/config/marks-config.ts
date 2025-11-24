import { DataMarksOptions, MarksOptions } from './marks-options';

export abstract class MarksConfig implements MarksOptions {
  readonly marksClass: string;
  readonly mixBlendMode: string;
}

export abstract class DataMarksConfig<Datum>
  extends MarksConfig
  implements DataMarksOptions<Datum>
{
  readonly data: Datum[];
  readonly datumClass: (d: Datum, i: number) => string;
}
