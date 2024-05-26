export class VicSvgTextWrapConfig {
  width: number;
  maintainXPosition: boolean;
  maintainYPosition: boolean;
  lineHeight: number;

  constructor(options?: Partial<VicSvgTextWrapConfig>) {
    this.maintainXPosition = false;
    this.maintainYPosition = false;
    this.lineHeight = 1.1;
    Object.assign(this, options);
  }
}
