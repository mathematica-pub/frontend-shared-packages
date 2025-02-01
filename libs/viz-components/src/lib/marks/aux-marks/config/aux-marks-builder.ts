const DEFAULT = {
  _mixBlendMode: 'normal',
};

export abstract class VicAuxMarksBuilder {
  protected _mixBlendMode: string;
  protected _class: (d: unknown) => string;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * Sets the mix-blend-mode of the marks.
   *
   * @default 'normal'
   */
  mixBlendMode(mixBlendMode: string): this {
    this._mixBlendMode = mixBlendMode;
    return this;
  }
}
