export class SvgWrapOptions {
  width: number;
  maintainXPosition: boolean;
  maintainYPosition: boolean;
  lineHeight: number;

  constructor(init?: Partial<SvgWrapOptions>) {
    this.maintainXPosition = false;
    this.maintainYPosition = false;
    this.lineHeight = 1.1;
    Object.assign(this, init);
  }
}
