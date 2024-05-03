import { ScaleContinuousNumeric } from 'd3';
import {
  DomainPadding,
  PaddedDomainArguments,
  VicDomainPadding,
} from './domain-padding';

export class VicPixelDomainPadding extends VicDomainPadding {
  type: DomainPadding.numPixels = DomainPadding.numPixels;
  numPixels: number;

  constructor(init?: Partial<VicPixelDomainPadding>) {
    super();
    this.numPixels = 40;
    Object.assign(this, init);
  }

  getPaddedValue(args: PaddedDomainArguments): number {
    let numPixels = this.numPixels;
    if (args.dimensionRange[0] > args.dimensionRange[1]) {
      // on vertical axis, the range is [100, 0]
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
    const adjustedPixelRange = [
      dimensionRange[0] + this.numPixels,
      dimensionRange[1] - this.numPixels,
    ];
    const scale = scaleFn(unpaddedDomain, adjustedPixelRange);
    return [scale.invert(dimensionRange[0]), scale.invert(dimensionRange[1])];
  }
}
