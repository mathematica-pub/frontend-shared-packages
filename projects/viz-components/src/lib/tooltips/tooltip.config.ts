export class VicTooltipConfig {
  show: boolean;
  type: 'svg' | 'html';

  constructor(options?: Partial<VicTooltipConfig>) {
    this.show = false;
    Object.assign(this, options);
  }
}
