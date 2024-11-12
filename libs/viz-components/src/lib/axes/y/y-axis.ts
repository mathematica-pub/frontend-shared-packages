import { Directive, Input } from '@angular/core';
import { axisLeft, axisRight } from 'd3';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { DataValue } from '../../core/types/values';
import { XyAxis } from '../base/xy-axis-base';
import { YAxisConfig } from './y-axis-config';

/**
 * A mixin that extends `XyAxis` with the functionality needed for a y-axis.
 *
 * For internal library use only.
 */
export function yAxisMixin<
  TickValue extends DataValue,
  T extends AbstractConstructor<XyAxis<TickValue>>,
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    @Input() override config: YAxisConfig<TickValue>;
    translate: string;

    setAxisFunction(): void {
      this.axisFunction = this.config.side === 'left' ? axisLeft : axisRight;
    }

    setTranslate(): void {
      const translate = this.getTranslateDistance();
      this.translate = `translate(${translate}, 0)`;
    }

    getTranslateDistance(): number {
      const range = this.scales.x.range();
      return this.config.side === 'left'
        ? this.getLeftTranslate(range)
        : this.getRightTranslate(range);
    }

    getLeftTranslate(range: [number, number]): number {
      return range[0];
    }

    getRightTranslate(range: [number, number]): number {
      return range[1] + this.chart.margin.right;
    }

    setScale(): void {
      this.scale = this.scales.y;
    }

    initNumTicks(): number {
      // value mimics D3's default
      const defaultNumTicks = this.chart.height / 50;
      if (defaultNumTicks < 1) {
        return 1;
      } else {
        return Math.floor(defaultNumTicks);
      }
    }
  }

  return Mixin;
}
