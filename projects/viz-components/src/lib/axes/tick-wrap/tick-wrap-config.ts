import { VicSvgTextWrapConfig } from '../../svg-text-wrap/svg-text-wrap-config';

/**
 * A config that specifies how axis tick labels should wrap.
 */
export class VicTickWrapConfig extends VicSvgTextWrapConfig {
  /**
   * The max-width for the tick labels.
   *
   * If value is 'bandwidth', tick labels will wrap at the bandwidth
   *  of the axis. This is for use with ordinal axes, most likely ordinal x-axes.
   *
   * If value is a number, tick labels will wrap at that value, in px.
   *
   * If value is a function with chart width and number of ticks as arguments,
   *  tick labels will wrap at the returned value, in px.
   */
  wrapWidth:
    | 'bandwidth'
    | number
    | ((chartWidth: number, numOfTicks: number) => number);
  override width: null;

  constructor(options: VicTickWrapConfig) {
    super(options);
    Object.assign(this, options);
  }
}
