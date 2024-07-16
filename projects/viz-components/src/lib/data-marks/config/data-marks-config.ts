import { VicDataMarksOptions } from './data-marks-options';

export abstract class VicDataMarksConfig<Datum>
  implements VicDataMarksOptions<Datum>
{
  readonly data: Datum[];
  readonly mixBlendMode: string;
  protected abstract initPropertiesFromData(): void;

  constructor() {
    this.mixBlendMode = 'normal';
  }
}
