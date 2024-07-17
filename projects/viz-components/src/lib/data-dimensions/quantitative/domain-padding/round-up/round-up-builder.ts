import { VicRoundUpDomainPadding } from './round-up';

const DEFAULT = {
  _sigDigits: () => 1,
};

export class VicRoundUpDomainPaddingBuilder {
  private _sigDigits: (d: number) => number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  sigDigits(sigDigits: (d: number) => number): this {
    this._sigDigits = sigDigits;
    return this;
  }

  build(): VicRoundUpDomainPadding {
    return new VicRoundUpDomainPadding({
      sigDigits: this._sigDigits,
    });
  }
}
