import { VicRoundUpToIntervalDomainPadding } from './round-to-interval';

const DEFAULT = {
  _interval: () => 1,
};

export class VicRoundUpToIntervalDomainPaddingBuilder {
  private _interval: (d: number) => number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  interval(interval: (d: number) => number): this {
    this._interval = interval;
    return this;
  }

  build(): VicRoundUpToIntervalDomainPadding {
    return new VicRoundUpToIntervalDomainPadding({
      interval: this._interval,
    });
  }
}
