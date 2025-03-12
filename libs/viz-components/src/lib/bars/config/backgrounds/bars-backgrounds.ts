import { BarsBackgroundsOptions } from './bars-backgrounds-options';

export class BarsBackgrounds {
  readonly color: string;
  readonly events: boolean;

  constructor(options: BarsBackgroundsOptions) {
    Object.assign(this, options);
  }
}
