import {
  DomainPadding,
  PaddedDomainArguments,
  VicDomainPadding,
} from './domain-padding';

const DEFAULT = {
  percentOver: 0.1,
};

export interface VicPercentOverDomainPaddingOptions {
  percentOver: number;
}

export class VicPercentOverDomainPadding
  extends VicDomainPadding
  implements VicPercentOverDomainPaddingOptions
{
  readonly percentOver: number;
  readonly type: DomainPadding.percentOver;

  constructor(options?: Partial<VicPercentOverDomainPadding>) {
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

/**
 *
 * @param {<VicPercentOverDomainPaddingOptions>} options
 * @param {number} options.percentOver - A value that specifies the percentage above the max value to pad the domain by. If the max value is 240, and the percentOver value is 0.1, the chart could accommodate values up to 264. Defaults to 0.1.
 * @returns
 */
export function vicPercentOverDomainPadding(
  options?: Partial<VicPercentOverDomainPaddingOptions>
): VicPercentOverDomainPadding {
  return new VicPercentOverDomainPadding(options);
}
