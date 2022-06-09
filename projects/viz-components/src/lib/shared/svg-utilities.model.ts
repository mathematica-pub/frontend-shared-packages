export class SvgWrapOptions {
  width: number;
  maintainXPosition: boolean;
  maintainYPosition: boolean;
  lineHeight: number;

  constructor() {
    this.maintainXPosition = false;
    this.maintainYPosition = false;
    this.lineHeight = 1.1;
  }
}
