import { VicPixelDomainPadding } from './pixel';

const DEFAULT = {
  _numPixels: 40,
};

export class VicPixelDomainPaddingBuilder {
  private _numPixels: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  numPixels(numPixels: number): this {
    this._numPixels = numPixels;
    return this;
  }

  build(): VicPixelDomainPadding {
    return new VicPixelDomainPadding({
      numPixels: this._numPixels,
    });
  }
}
