import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { XyAxis } from '../xy-axis';

export function OrdinalAxisMixin<T extends AbstractConstructor<XyAxis>>(
  Base: T
) {
  abstract class Mixin extends Base {
    defaultTickSizeOuter = 0;

    constructor(...args: any[]) {
      super(...args);
    }

    setAxis(axisFunction: any): void {
      const tickSizeOuter =
        this.config.tickSizeOuter || this.defaultTickSizeOuter;
      this.axis = axisFunction(this.scale).tickSizeOuter(tickSizeOuter);
    }
  }

  return Mixin;
}
