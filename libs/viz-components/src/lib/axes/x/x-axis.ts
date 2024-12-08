import { Directive, Input } from '@angular/core';
import { axisBottom, axisTop, select } from 'd3';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { DataValue } from '../../core/types/values';
import { XyAxis } from '../base/xy-axis-base';
import { XAxisConfig } from './x-axis-config';

export function xAxisMixin<
  TickValue extends DataValue,
  T extends AbstractConstructor<XyAxis<TickValue>>,
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    @Input() override config: XAxisConfig<TickValue>;
    translate: string;

    setTranslate(): void {
      console.log('setTranslate', this.config);
      const translate = this.getTranslateDistance();
      this.translate = `translate(0, ${translate})`;
    }

    getTranslateDistance(): number {
      const range = this.scales.y.range();
      return this.config.side === 'top'
        ? this.getTopTranslate(range)
        : this.getBottomTranslate(range);
    }

    getTopTranslate(range: [number, number]): number {
      return range[1];
    }

    getBottomTranslate(range: [number, number]): number {
      return range[0] - range[1] + this.chart.margin.top;
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

      const spaceFromHorizontalEdge = 4;
      let x = config.offset.x;
      let y = config.offset.y;
      y +=
        this.config.side === 'top'
          ? this.chart.margin.top * -1 + spaceFromHorizontalEdge
          : this.chart.margin.bottom - spaceFromHorizontalEdge;
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

      select(this.axisRef.nativeElement).selectAll('.x-axis-label').remove();

      select(this.axisRef.nativeElement).call((g) =>
        g
          .append('text')
          .attr('class', 'x-axis-label axis-label')
          .attr('x', x)
          .attr('y', y)
          .attr('text-anchor', anchor)
          .text(this.config.label.text)
      );
    }
  }

  return Mixin;
}
