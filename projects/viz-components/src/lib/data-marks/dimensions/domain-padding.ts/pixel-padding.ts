import { ScaleContinuousNumeric } from 'd3';
import {
  DomainPadding,
  DomainPaddingConfig,
  PaddedDomainArguments,
} from './domain-padding';

export class VicPixelDomainPaddingConfig extends DomainPaddingConfig {
  type: DomainPadding.numPixels = DomainPadding.numPixels;
  numPixels: number;

  constructor(init?: Partial<VicPixelDomainPaddingConfig>) {
    super();
    this.numPixels = 40;
    Object.assign(this, init);
  }

  getPaddedValue(args: PaddedDomainArguments): number {
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

  override getPaddedDomainForPositiveAndNegativeValues(
    domainMinArgs: PaddedDomainArguments,
    domainMaxArgs: PaddedDomainArguments,
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
