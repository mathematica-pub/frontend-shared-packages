import { safeAssign } from '@mathstack/app-kit';

const DEFAULT = {
  _class: () => '',
  _mixBlendMode: 'normal',
};

export abstract class VicAuxMarksBuilder<Datum> {
  protected _mixBlendMode: string;
  protected _class: (d: Datum) => string;

  constructor() {
    safeAssign(this, DEFAULT);
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
