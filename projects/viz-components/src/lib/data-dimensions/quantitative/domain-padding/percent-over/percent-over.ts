import {
  DomainPadding,
  PaddedDomainArguments,
  VicDomainPadding,
} from '../domain-padding';
import { PercentOverDomainPaddingOptions } from './percent-over-options';

export class VicPercentOverDomainPadding
  extends VicDomainPadding
  implements PercentOverDomainPaddingOptions
{
  readonly percentOver: number;
  readonly type: DomainPadding.percentOver;

  constructor(options?: Partial<VicPercentOverDomainPadding>) {
    super();
    Object.assign(this, options);
    this.type = DomainPadding.percentOver;
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
