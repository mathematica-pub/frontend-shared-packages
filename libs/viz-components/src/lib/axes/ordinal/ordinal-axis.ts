import { Directive, Input } from '@angular/core';
import { format, utcFormat } from 'd3';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { DataValue } from '../../core/types/values';
import { XyAxis } from '../base/xy-axis-base';
import { Ticks } from '../ticks/ticks';
import { VicOrdinalAxisConfig as OrdinalAxisConfig } from './ordinal-axis-config';

export function ordinalAxisMixin<
  Tick extends DataValue,
  T extends AbstractConstructor<XyAxis<Tick, Ticks<Tick>>>,
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    @Input() override config: OrdinalAxisConfig<Tick>;

    setTicks(tickFormat: string | ((value: Tick) => string)): void {
      this.axis.tickFormat((d) => {
        const formatter = d instanceof Date ? utcFormat : format;
        return typeof tickFormat === 'function'
          ? tickFormat(d)
          : formatter(tickFormat)(d);
      });
    }
  }

  return Mixin;
}
