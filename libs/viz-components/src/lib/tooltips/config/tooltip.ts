export class Tooltip {
  show: boolean;
  type: 'svg' | 'html';

  constructor(options?: Partial<Tooltip>) {
    this.show = false;
    Object.assign(this, options);
  }
}
