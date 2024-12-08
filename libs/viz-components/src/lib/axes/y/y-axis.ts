import { Directive, Input } from '@angular/core';
import { axisLeft, axisRight, select } from 'd3';
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

    createLabel(): void {
      const config = this.config.label;
      if (!config) return;

      let y: number;
      let x = config.offset.x;
      let anchor: 'start' | 'middle' | 'end';
      let rotate: string | null = null;
      const range = this.scales.y.range();
      console.log(range);

      if (config.position === 'start') {
        y = range[1] + config.offset.y;
        anchor = config.anchor || 'end';
      } else if (config.position === 'middle') {
        y = (range[0] - range[1]) / 2 + config.offset.y;
        x +=
          this.config.side === 'left'
            ? this.chart.margin.left - 12
            : this.chart.width - 12;
        anchor = config.anchor || 'middle';
        rotate = 'rotate(-90)';
      } else {
        y = range[0] + config.offset.y;
        anchor = config.anchor || 'end';
      }

      select(this.axisRef.nativeElement).selectAll('.y-axis-label').remove();

      select(this.axisRef.nativeElement).call((g) =>
        g
          .append('text')
          .attr('class', 'y-axis-label axis-label')
          .attr('transform', rotate)
          .attr('x', rotate ? y * -1 : x)
          .attr('y', rotate ? x * -1 : y)
          .attr('text-anchor', anchor)
          .text(this.config.label.text)
      );
    }
  }

  return Mixin;
}
