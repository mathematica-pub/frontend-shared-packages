import { ScaleContinuousNumeric } from 'd3';
import { ValueExtent } from '../../../core/types/values';
import { PercentOverDomainPadding } from './percent-over/percent-over';
import { PixelDomainPadding } from './pixel/pixel';
import { RoundUpToIntervalDomainPadding } from './round-to-interval/round-to-interval';
import { RoundUpToSigFigDomainPadding } from './round-to-sig-fig/round-to-sig-fig';

export enum DomainPaddingType {
  roundUp = 'roundUp',
  roundInterval = 'roundInterval',
  percentOver = 'percentOver',
  numPixels = 'numPixels',
}

export type ConcreteDomainPadding =
  | RoundUpToSigFigDomainPadding
  | RoundUpToIntervalDomainPadding
  | PercentOverDomainPadding
  | PixelDomainPadding;

export interface PaddedDomainArguments {
  value?: number;
  valueType: keyof typeof ValueExtent;
  scaleFn?: (
    domain?: Iterable<number>,
    range?: Iterable<number>
  ) => ScaleContinuousNumeric<number, number>;
  unpaddedDomain?: [number, number];
  dimensionRange?: [number, number];
}

export abstract class DomainPadding {
  abstract getPaddedValue(args: PaddedDomainArguments): number;

  getPaddedDomain(
    unpaddedDomain: [number, number],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scaleFn: any,
    dimensionRange?: [number, number]
  ): [number, number] {
    const domainMinArgs: PaddedDomainArguments = {
      value: unpaddedDomain[0],
      valueType: 'min',
      scaleFn,
      unpaddedDomain,
      dimensionRange: dimensionRange,
    };
    const domainMaxArgs: PaddedDomainArguments = {
      value: unpaddedDomain[1],
      valueType: 'max',
      scaleFn,
      unpaddedDomain,
      dimensionRange: dimensionRange,
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
        dimensionRange
      );
    }
    return [domainMin, domainMax];
  }

  protected getPaddedDomainForPositiveAndNegativeValues(
    domainMinArgs: PaddedDomainArguments,
    domainMaxArgs: PaddedDomainArguments,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    ...args: any
  ): [number, number] {
    return [
      this.getPaddedValue(domainMinArgs),
      this.getPaddedValue(domainMaxArgs),
    ];
  }
}
