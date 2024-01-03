export class VicTooltipConfig {
  show: boolean;
  type: 'svg' | 'html';

  constructor(init?: Partial<VicTooltipConfig>) {
    this.show = false;
    Object.assign(this, init);
  }
}
