import {
  DomainPadding,
  PaddedDomainArguments,
  VicDomainPadding,
} from './domain-padding';

const DEFAULT = {
  percentOver: 0.1,
};

export interface PercentOverDomainPaddingOptions {
  percentOver: number;
}

export class PercentOverDomainPadding
  extends VicDomainPadding
  implements PercentOverDomainPaddingOptions
{
  readonly percentOver: number;
  readonly type: DomainPadding.percentOver;

  constructor(options?: Partial<PercentOverDomainPadding>) {
    super();
    Object.assign(this, options);
    this.type = DomainPadding.percentOver;
    this.percentOver = this.percentOver ?? DEFAULT.percentOver;
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
