import { SvgTextWrapConfig } from './svg-wrap.config';

/**
 * A config that specifies how axis tick labels should wrap.
 */
export class TickWrapConfig extends SvgTextWrapConfig {
  /**
   * The max-width for the tick labels.
   *
   * If value is 'bandwidth', tick labels will wrap at the bandwidth
   *  of the axis. This is for use with ordinal axes, most likely ordinal x-axes.
   *
   * If value is a number, tick labels will wrap at that value, in px.
   *
   * If value is a function with scale as an argument, tick labels will wrap
   *  at the returned value, in px.
   */
  wrapWidth: 'bandwidth' | number | ((axisScale: any) => number);
  override width: never;

  constructor(init?: Partial<TickWrapConfig>) {
    super();
    Object.assign(this, init);
  }
}
