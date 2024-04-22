import {
  DomainPadding,
  DomainPaddingConfig,
  PaddedDomainArguments,
} from '../data-domain-padding';

export class VicPercentOverDomainPaddingConfig extends DomainPaddingConfig {
  type: DomainPadding.percentOver = DomainPadding.percentOver;
  percentOver: number;

  constructor(init?: Partial<VicPercentOverDomainPaddingConfig>) {
    super();
    this.percentOver = 0.1;
    Object.assign(this, init);
  }

  getPaddedDomainValue(args: PaddedDomainArguments): number {
    return this.getQuantitativeDomainMaxPercentOver(
      args.value,
      this.percentOver
    );
  }

  getQuantitativeDomainMaxPercentOver(value: number, percent: number): number {
    let overValue = Math.abs(value) * (1 + percent);
    if (value < 0) overValue = -overValue;
    return overValue;
  }
}
