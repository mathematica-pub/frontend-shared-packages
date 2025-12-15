import { safeAssign } from '@mathstack/app-kit';

export class Tooltip {
  show: boolean;
  type: 'svg' | 'html';

  constructor(options?: Partial<Tooltip>) {
    this.show = false;
    safeAssign(this, options);
  }
}
