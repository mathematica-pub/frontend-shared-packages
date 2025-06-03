import { Directive, Input } from '@angular/core';
import { axisLeft, axisRight } from 'd3';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { ContinuousValue, DataValue } from '../../core/types/values';
import { XyAxis } from '../base/xy-axis-base';
import { Ticks } from '../ticks/ticks';
import { YAxisConfig } from './y-axis-config';

/**
 * A mixin that extends `XyAxis` with the functionality needed for a y-axis.
 *
 * For internal library use only.
 */
export function yAxisMixin<
  Tick extends DataValue | ContinuousValue,
  TicksConfig extends Ticks<Tick>,
  T extends AbstractConstructor<XyAxis<Tick, TicksConfig>>,
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    @Input() override config: YAxisConfig<Tick, TicksConfig>;
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
      return range[1];
    }

    getBaselineTranslate(): string | null {
      if (this.otherAxisHasPosAndNegValues('y')) {
        const rangeIndexForSide = this.config.side === 'left' ? 0 : 1;
        const translateDistance =
          this.scales.x(0) - this.scales.x.range()[rangeIndexForSide];
        return `translate(${translateDistance}, 0)`;
      }
      return null;
    }

    setScale(): void {
      this.scale = this.scales.y;
    }

    initNumTicks(): number {
      // value mimics D3's default
      const defaultNumTicks = this.chart.config.height / 50;
      if (defaultNumTicks < 1) {
        return 1;
      } else {
        return Math.floor(defaultNumTicks);
      }
    }

    createLabel(): void {
      const config = this.config.label;
      if (!config) return;

      let y = config.offset.y;
      let x = config.offset.x;
      let anchor: 'start' | 'middle' | 'end';
      let rotate: string | null = null;
      let alignmentBaseline = null;
      const range = this.scales.y.range();

      if (config.position === 'start') {
        y += range[1];
        anchor = config.anchor || 'end';
      } else if (config.position === 'middle') {
        rotate = 'rotate(-90)';
        x = config.offset.x * -1;
        y = config.offset.y;
        y += (range[0] - range[1]) / 2 + +this.chart.config.margin.top;
        x +=
          this.config.side === 'left'
            ? this.chart.config.margin.left
            : this.chart.config.width;
        anchor = config.anchor || 'middle';
        // otherwise will separate lines if wrapped
        if (config.wrap) {
          config.wrap.maintainXPosition = true;
        }
        alignmentBaseline =
          this.config.side === 'left' ? 'hanging' : 'baseline';
      } else {
        y += range[0];
        anchor = config.anchor || 'end';
      }

      let label = this.axisGroup.select<SVGTextElement>(`.${this.class.label}`);
      const needsInit = label.empty();

      if (needsInit) {
        label = this.axisGroup.append('text').attr('class', this.class.label);
      }

      label.text(this.config.label.text);

      if (rotate) {
        const edgeOffset = this.config.side === 'left' ? 1 : -1;
        const rotatedX = y * -1;
        const rotatedY =
          this.config.side === 'left' ? x * -1 : this.chart.config.margin.right;

        label.style('visibility', 'hidden');

        if (config.wrap) {
          requestAnimationFrame(() => {
            label.attr('x', x).attr('y', y);
            this.config.label.wrap.wrap(label);
            label.attr('transform', rotate).style('visibility', 'visible');

            label
              .selectAll('tspan')
              .attr('x', rotatedX)
              .attr('text-anchor', anchor)
              .attr('alignment-baseline', alignmentBaseline);

            label.select('tspan').attr('y', rotatedY + edgeOffset);
          });
        } else {
          label
            .attr('x', rotatedX)
            .attr('y', rotatedY + edgeOffset)
            .attr('transform', rotate)
            .attr('text-anchor', anchor)
            .attr('alignment-baseline', alignmentBaseline)
            .style('visibility', 'visible');
        }
      } else {
        label
          .attr('x', x)
          .attr('y', y)
          .attr('transform', null)
          .attr('text-anchor', anchor)
          .attr('alignment-baseline', alignmentBaseline);

        if (config.wrap) {
          label.style('visibility', 'hidden');
          requestAnimationFrame(() => {
            this.config.label.wrap.wrap(label);
            label.style('visibility', 'visible');
          });
        }
      }
    }
  }

  return Mixin;
}
