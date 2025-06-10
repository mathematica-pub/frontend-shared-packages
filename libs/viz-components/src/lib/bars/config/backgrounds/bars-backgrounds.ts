import { safeAssign } from '@hsi/app-dev-kit';
import { BarsBackgroundsOptions } from './bars-backgrounds-options';

export class BarsBackgrounds {
  readonly color: string;
  readonly events: boolean;

  constructor(options: BarsBackgroundsOptions) {
    safeAssign(this, options);
  }
}
