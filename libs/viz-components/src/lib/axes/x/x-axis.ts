import { Directive, Input } from '@angular/core';
import { axisBottom, axisTop } from 'd3';
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

    getDomainTranslate(): string | null {
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
          ? this.chart.margin.top * -1 + spaceFromMarginEdge
          : this.chart.margin.bottom - spaceFromMarginEdge;
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

      this.axisGroup.selectAll(`.${this.class.label}`).remove();

      this.axisGroup.call((g) =>
        g
          .append('text')
          .attr('class', this.class.label)
          .attr('x', x)
          .attr('y', y)
          .attr('text-anchor', anchor)
          .text(this.config.label.text)
      );

      if (config.wrap) {
        this.config.label.wrap.wrap(
          this.axisGroup.select(`.${this.class.label}`)
        );

        this.axisGroup.selectAll(`.${this.class.label} tspan`).attr('x', x);
      }
    }
  }

  return Mixin;
}
