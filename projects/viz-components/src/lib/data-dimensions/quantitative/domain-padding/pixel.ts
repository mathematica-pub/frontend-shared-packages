import { ScaleContinuousNumeric } from 'd3';
import {
  DomainPadding,
  PaddedDomainArguments,
  VicDomainPadding,
} from './domain-padding';

const DEFAULT = {
  numPixels: 40,
};

export interface VicPixelDomainPaddingOptions {
  numPixels: number;
}

export class VicPixelDomainPadding
  extends VicDomainPadding
  implements VicPixelDomainPaddingOptions
{
  readonly numPixels: number;
  readonly type: DomainPadding.numPixels = DomainPadding.numPixels;

  constructor(options?: Partial<VicPixelDomainPaddingOptions>) {
    super();
    Object.assign(this, options);
    this.type = DomainPadding.numPixels;
    this.numPixels = this.numPixels ?? DEFAULT.numPixels;
  }

  getPaddedValue(args: PaddedDomainArguments): number {
    let numPixels = this.numPixels;
    if (args.dimensionRange[0] > args.dimensionRange[1]) {
      // This covers the case when this is applied to the vertical axis
      // On the vertical axis, the range is [highValue, lowValue], i.e. [100, 0]
      numPixels = -1 * this.numPixels;
    }
    const value =
      args.valueType === 'min'
        ? args.unpaddedDomain[0]
        : args.unpaddedDomain[1];
    if (value === 0)
      return args.valueType === 'min' ? value - numPixels : value + numPixels;
    const adjustedPixelRange =
      args.valueType === 'min' && args.unpaddedDomain[0] < 0
        ? [args.dimensionRange[0] + numPixels, args.dimensionRange[1]]
        : [args.dimensionRange[0], args.dimensionRange[1] - numPixels];
    const scale = args.scaleFn(args.unpaddedDomain, adjustedPixelRange);
    const targetVal =
      args.valueType === 'min'
        ? args.dimensionRange[0]
        : args.dimensionRange[1];
    return scale.invert(targetVal);
  }

  protected override getPaddedDomainForPositiveAndNegativeValues(
    domainMinArgs: PaddedDomainArguments,
    domainMaxArgs: PaddedDomainArguments,
    unpaddedDomain: [number, number],
    scaleFn: (
      domain?: Iterable<number>,
      range?: Iterable<number>
    ) => ScaleContinuousNumeric<number, number>,
    dimensionRange: [number, number]
  ): [number, number] {
    let adjustedPixelRange;
    if (dimensionRange[0] < dimensionRange[1]) {
      adjustedPixelRange = [
        dimensionRange[0] + this.numPixels,
        dimensionRange[1] - this.numPixels,
      ];
    } else {
      adjustedPixelRange = [
        dimensionRange[0] - this.numPixels,
        dimensionRange[1] + this.numPixels,
      ];
    }
    const scale = scaleFn(unpaddedDomain, adjustedPixelRange);
    return [scale.invert(dimensionRange[0]), scale.invert(dimensionRange[1])];
  }
}
