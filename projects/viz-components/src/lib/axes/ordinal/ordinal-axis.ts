import { format, timeFormat } from 'd3';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { XyAxis } from '../xy-axis';

/**
 * A mixin that extends `XyAxis` with the functionality needed for an ordinal axis.
 *
 * For internal library use only.
 */
export function OrdinalAxisMixin<T extends AbstractConstructor<XyAxis>>(
  Base: T
) {
  abstract class Mixin extends Base {
    defaultTickSizeOuter = 0;

    setAxis(axisFunction: any): void {
      const tickFormat = this.config.tickFormat ?? undefined;
      const tickSizeOuter =
        this.config.tickSizeOuter || this.defaultTickSizeOuter;
      this.axis = axisFunction(this.scale).tickSizeOuter(tickSizeOuter);
      if (tickFormat) {
        this.setTicks(tickFormat);
      }
    }

    setTicks(tickFormat: string | ((value: any) => string)): void {
      this.axis.tickFormat((d) => {
        const formatter = d instanceof Date ? timeFormat : format;
        return typeof tickFormat === 'function'
          ? tickFormat(d)
          : formatter(tickFormat)(d);
      });
    }
  }

  return Mixin;
}
