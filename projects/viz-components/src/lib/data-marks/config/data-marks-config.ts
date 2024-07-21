import { DataMarksOptions } from './data-marks-options';

export abstract class DataMarksConfig<Datum>
  implements DataMarksOptions<Datum>
{
  readonly data: Datum[];
  readonly mixBlendMode: string;
  protected abstract initPropertiesFromData(): void;

  constructor() {
    this.mixBlendMode = 'normal';
  }
}
