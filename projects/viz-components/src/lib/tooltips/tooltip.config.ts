export class TooltipConfig {
  show: boolean;
  type: 'svg' | 'html';

  constructor(init?: Partial<TooltipConfig>) {
    this.show = false;
    Object.assign(this, init);
  }
}
