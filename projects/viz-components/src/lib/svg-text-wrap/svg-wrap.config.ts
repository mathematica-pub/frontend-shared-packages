export class SvgTextWrapConfig {
  // test comment
  width: number;
  maintainXPosition: boolean;
  maintainYPosition: boolean;
  /**
   * multiline test comment
   */
  lineHeight: number;

  constructor(init?: Partial<SvgTextWrapConfig>) {
    this.maintainXPosition = false;
    // another test comment
    this.maintainYPosition = false;
    this.lineHeight = 1.1;
    Object.assign(this, init);
  }
}
