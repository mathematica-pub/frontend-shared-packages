import { safeAssign } from '@hsi/app-dev-kit';

export class Tooltip {
  show: boolean;
  type: 'svg' | 'html';

  constructor(options?: Partial<Tooltip>) {
    this.show = false;
    safeAssign(this, options);
  }
}
