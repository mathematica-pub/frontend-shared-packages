import { ScaleContinuousNumeric } from 'd3';
import { VicPercentOverDomainPaddingConfig } from './percent-over-padding';
import { VicPixelDomainPaddingConfig } from './pixel-padding';
import { VicRoundUpToIntervalDomainPaddingConfig } from './round-to-interval-padding';
import { VicRoundUpDomainPaddingConfig } from './round-up-padding';

export enum DomainPadding {
  roundUp = 'roundUp',
  roundInterval = 'roundInterval',
  percentOver = 'percentOver',
  numPixels = 'numPixels',
}

export type DomainExtent = 'max' | 'min';

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
  abstract getPaddedValue(args: PaddedDomainArguments): number;

  getPaddedDomain(
    unpaddedDomain: [number, number],
    scaleFn?: any,
    chartRange?: [number, number]
  ): [number, number] {
    const domainMinArgs: PaddedDomainArguments = {
      value: unpaddedDomain[0],
      valueType: 'min',
      scaleFn,
      unpaddedDomain,
      chartRange,
    };
    const domainMaxArgs: PaddedDomainArguments = {
      value: unpaddedDomain[1],
      valueType: 'max',
      scaleFn,
      unpaddedDomain,
      chartRange,
    };
    let domainMin: number;
    let domainMax: number;
    if (unpaddedDomain[0] >= 0 && unpaddedDomain[1] >= 0) {
      domainMin = unpaddedDomain[0];
      domainMax = this.getPaddedValue(domainMaxArgs);
    } else if (unpaddedDomain[0] <= 0 && unpaddedDomain[1] <= 0) {
      domainMin = this.getPaddedValue(domainMinArgs);
      domainMax = unpaddedDomain[1];
    } else if (unpaddedDomain[0] < 0 && unpaddedDomain[1] > 0) {
      [domainMin, domainMax] = this.getPaddedDomainForPositiveAndNegativeValues(
        domainMinArgs,
        domainMaxArgs,
        unpaddedDomain,
        scaleFn,
        chartRange
      );
    }
    return [domainMin, domainMax];
  }

  protected getPaddedDomainForPositiveAndNegativeValues(
    domainMinArgs: PaddedDomainArguments,
    domainMaxArgs: PaddedDomainArguments,
    ...args: any
  ): [number, number] {
    return [
      this.getPaddedValue(domainMinArgs),
      this.getPaddedValue(domainMaxArgs),
    ];
  }
}
