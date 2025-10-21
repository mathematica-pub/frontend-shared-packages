import { safeAssign } from '@mathstack/app-kit';
import {
  DomainPadding,
  DomainPaddingType,
  PaddedDomainArguments,
} from '../domain-padding';
import { PercentOverDomainPaddingOptions } from './percent-over-options';

export class PercentOverDomainPadding
  extends DomainPadding
  implements PercentOverDomainPaddingOptions {
  readonly percentOver: number;
  readonly type: DomainPaddingType.percentOver;

  constructor(options: PercentOverDomainPaddingOptions) {
    super();
    safeAssign(this, options);
    this.type = DomainPaddingType.percentOver;
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
