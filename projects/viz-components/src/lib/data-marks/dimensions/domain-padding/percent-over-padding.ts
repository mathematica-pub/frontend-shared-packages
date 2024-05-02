import {
  DomainPadding,
  PaddedDomainArguments,
  VicDomainPadding,
} from './domain-padding';

export class VicPercentOverDomainPadding extends VicDomainPadding {
  type: DomainPadding.percentOver = DomainPadding.percentOver;
  percentOver: number;

  constructor(init?: Partial<VicPercentOverDomainPadding>) {
    super();
    this.percentOver = 0.1;
    Object.assign(this, init);
  }

  getPaddedValue(args: PaddedDomainArguments): number {
    return this.getQuantitativeDomainMaxPercentOver(
      args.value,
      this.percentOver
    );
  }

  private getQuantitativeDomainMaxPercentOver(
    value: number,
    percent: number
  ): number {
    let overValue = Math.abs(value) * (1 + percent);
    if (value < 0) overValue = -overValue;
    return overValue;
  }
}
