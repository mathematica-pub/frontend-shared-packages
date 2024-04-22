import { ScaleContinuousNumeric } from 'd3';
import { DomainExtent } from '../../public-api';
import { ValueUtilities } from '../shared/value-utilities.class';

export enum DomainPadding {
  roundUp = 'roundUp',
  roundInterval = 'roundInterval',
  percentOver = 'percentOver',
  numPixels = 'numPixels',
}

export type VicDomainPaddingConfig =
  | VicRoundUpDomainPaddingConfig
  | VicRoundUpToIntervalDomainPaddingConfig
  | VicPercentOverDomainPaddingConfig
  | VicPixelDomainPaddingConfig;

export interface PaddedDomainArguments {
  value?: number;
  valueType: DomainExtent;
  scaleFn?: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;
  unpaddedDomain?: [number, number];
  chartRange?: [number, number];
}

export abstract class DomainPaddingConfig {
  abstract getPaddedDomainValue(args: PaddedDomainArguments): number;
}

export class VicRoundUpDomainPaddingConfig extends DomainPaddingConfig {
  type: DomainPadding.roundUp = DomainPadding.roundUp;
  sigDigits: (d: any) => number;

  constructor(init?: Partial<VicRoundUpDomainPaddingConfig>) {
    super();
    this.sigDigits = () => 1;
    Object.assign(this, init);
  }

  getPaddedDomainValue(args: PaddedDomainArguments): number {
    return ValueUtilities.getValueRoundedToNSignificantDigits(
      args.value,
      this.sigDigits(args.value),
      args.valueType
    );
  }
}

export class VicRoundUpToIntervalDomainPaddingConfig extends DomainPaddingConfig {
  type: DomainPadding.roundInterval = DomainPadding.roundInterval;
  interval: (maxValue: number) => number;

  constructor(init?: Partial<VicRoundUpToIntervalDomainPaddingConfig>) {
    super();
    this.interval = () => 1;
    Object.assign(this, init);
  }

  getPaddedDomainValue(args: PaddedDomainArguments): number {
    return ValueUtilities.getValueRoundedToInterval(
      args.value,
      this.interval(args.value),
      args.valueType
    );
  }
}

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

export class VicPixelDomainPaddingConfig extends DomainPaddingConfig {
  type: DomainPadding.numPixels = DomainPadding.numPixels;
  numPixels: number;

  constructor(init?: Partial<VicPixelDomainPaddingConfig>) {
    super();
    this.numPixels = 40;
    Object.assign(this, init);
  }

  getPaddedDomainValue(args: PaddedDomainArguments): number {
    if (args.chartRange[1] < args.chartRange[0])
      this.numPixels = -1 * this.numPixels; // When would we ever have this?
    const value =
      args.valueType === 'min'
        ? args.unpaddedDomain[0]
        : args.unpaddedDomain[1];
    if (value === 0) return value;
    const adjustedPixelRange =
      args.valueType === 'min' && args.unpaddedDomain[0] < 0
        ? [args.chartRange[0] + this.numPixels, args.chartRange[1]]
        : [args.chartRange[0], args.chartRange[1] - this.numPixels];
    const scale = args.scaleFn(args.unpaddedDomain, adjustedPixelRange);
    const targetVal =
      args.valueType === 'min' ? args.chartRange[0] : args.chartRange[1];
    return scale.invert(targetVal);
  }

  getPositiveAndNegativePaddedDomainValues(
    unpaddedDomain: [number, number],
    scaleFn: (
      domain?: Iterable<number>,
      range?: Iterable<number>
    ) => ScaleContinuousNumeric<number, number>,
    chartRange: [number, number]
  ): [number, number] {
    const adjustedPixelRange = [
      chartRange[0] + this.numPixels,
      chartRange[1] - this.numPixels,
    ];
    const scale = scaleFn(unpaddedDomain, adjustedPixelRange);
    return [scale.invert(chartRange[0]), scale.invert(chartRange[1])];
  }
}
