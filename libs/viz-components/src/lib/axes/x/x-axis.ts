import { Directive, Input } from '@angular/core';
import { axisBottom, axisTop } from 'd3';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { ContinuousValue, DataValue } from '../../core/types/values';
import { XyAxis } from '../base/xy-axis-base';
import { Ticks } from '../ticks/ticks';
import { XAxisConfig } from './x-axis-config';

export function xAxisMixin<
  Tick extends DataValue | ContinuousValue,
  TicksConfig extends Ticks<Tick>,
  T extends AbstractConstructor<XyAxis<Tick, TicksConfig>>,
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    @Input() override config: XAxisConfig<Tick, TicksConfig>;
    translate: string;

    setTranslate(): void {
      const translate = this.getTranslateDistance();
      this.translate = `translate(0, ${translate})`;
    }

    getTranslateDistance(): number {
      return this.config.side === 'top'
        ? this.getTopTranslate()
        : this.getBottomTranslate();
    }

    getTopTranslate(): number {
      return this.scales.y.range()[1];
    }

    getBottomTranslate(): number {
      return this.scales.y.range()[0];
    }

    getBaselineTranslate(): string | null {
      if (this.otherAxisHasPosAndNegValues('x')) {
        const rangeIndexForSide = this.config.side === 'top' ? 1 : 0;
        const translateDistance =
          this.scales.y(0) - this.scales.y.range()[rangeIndexForSide];
        return `translate(0, ${translateDistance})`;
      }
      return null;
    }

    setScale(): void {
      this.scale = this.scales.x;
    }

    setAxisFunction(): void {
      this.axisFunction = this.config.side === 'top' ? axisTop : axisBottom;
    }

    createLabel(): void {
      const config = this.config.label;
      if (!config) return;

      const spaceFromMarginEdge = 4;
      let x = config.offset.x;
      let y = config.offset.y;

      y +=
        this.config.side === 'top'
          ? this.chart.config.margin.top * -1 + spaceFromMarginEdge
          : this.chart.config.margin.bottom - spaceFromMarginEdge;

      let anchor: 'start' | 'middle' | 'end';
      const range = this.scales.x.range();

      if (config.position === 'start') {
        x += range[0];
        anchor = config.anchor || 'start';
      } else if (config.position === 'middle') {
        x += (range[1] - range[0]) / 2 + range[0];
        anchor = config.anchor || 'middle';
      } else {
        x += range[1];
        anchor = config.anchor || 'end';
      }

      let label = this.axisGroup.select<SVGTextElement>(`.${this.class.label}`);
      const needsInit = label.empty();

      if (needsInit) {
        label = this.axisGroup
          .append<SVGTextElement>('text')
          .attr('class', this.class.label);
      }

      label
        .text(this.config.label.text)
        .attr('text-anchor', anchor)
        .attr('y', y)
        .style('visibility', config.wrap ? 'hidden' : 'visible');

      if (config.wrap) {
        requestAnimationFrame(() => {
          this.config.label.wrap.wrap(label);
          label.attr('x', x).style('visibility', 'visible');

          label.selectAll('tspan').attr('x', x);
        });
      } else {
        label.attr('x', x);
      }
    }
  }

  return Mixin;
}
