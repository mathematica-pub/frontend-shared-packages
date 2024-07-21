import { Directive, Input } from '@angular/core';
import { format, timeFormat } from 'd3';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { DataValue } from '../../core/types/values';
import { XyAxis } from '../xy-axis';
import { VicOrdinalAxisConfig } from './ordinal-axis-config';

/**
 * A mixin that extends `XyAxis` with the functionality needed for an ordinal axis.
 *
 * For internal library use only.
 */
export function ordinalAxisMixin<
  TickValue extends DataValue,
  T extends AbstractConstructor<XyAxis<TickValue>>
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    @Input() override config: VicOrdinalAxisConfig<TickValue>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAxis(axisFunction: any): void {
      const tickFormat = this.config.tickFormat ?? undefined;
      this.axis = axisFunction(this.scale).tickSizeOuter(
        this.config.tickSizeOuter
      );
      if (tickFormat) {
        this.setTicks(tickFormat);
      }
    }

    setTicks(tickFormat: string | ((value: TickValue) => string)): void {
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
