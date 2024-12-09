import { Directive, Input } from '@angular/core';
import { axisBottom, axisTop } from 'd3';
import { Orientation } from '../../core';
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

    setGridLineOrientation(): void {
      this.gridLineOrientation = Orientation.vertical;
    }

    setAxisFunction(): void {
      this.axisFunction = this.config.side === 'top' ? axisTop : axisBottom;
    }
  }

  return Mixin;
}
