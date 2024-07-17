import { VicPercentOverDomainPadding } from './percent-over';

const DEFAULT = {
  _percentOver: 0.1,
};

export class VicPercentOverDomainPaddingBuilder {
  private _percentOver: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  percentOver(percentOver: number): this {
    this._percentOver = percentOver;
    return this;
  }

  build(): VicPercentOverDomainPadding {
    return new VicPercentOverDomainPadding({
      percentOver: this._percentOver,
    });
  }
}
