export class VicSvgWrapConfig {
  // test comment
  width: number;
  maintainXPosition: boolean;
  maintainYPosition: boolean;
  /**
   * multiline test comment
   */
  lineHeight: number;

  constructor(init?: Partial<VicSvgWrapConfig>) {
    this.maintainXPosition = false;
    // another test comment
    this.maintainYPosition = false;
    this.lineHeight = 1.1;
    Object.assign(this, init);
  }
}

export class TickWrapConfig extends VicSvgWrapConfig {
  wrapWidth: 'bandwidth' | number;
  override width: never;
  constructor(init?: Partial<TickWrapConfig>) {
    super();
    Object.assign(this, init);
  }
}
