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
      const tickSizeOuter =
        this.config.tickSizeOuter || this.defaultTickSizeOuter;
      this.axis = axisFunction(this.scale).tickSizeOuter(tickSizeOuter);
    }
  }

  return Mixin;
}
