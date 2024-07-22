import { Directive, Input } from '@angular/core';
import { axisBottom, axisTop } from 'd3';
import { Observable, filter, map } from 'rxjs';
import { Ranges } from '../../chart/chart.component';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { DataValue } from '../../core/types/values';
import { XyAxis, XyAxisScale } from '../base/xy-axis-base';
import { XAxisConfig } from './x-axis-config';

export function xAxisMixin<
  TickValue extends DataValue,
  T extends AbstractConstructor<XyAxis<TickValue>>
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    @Input() override config: XAxisConfig<TickValue>;
    translate$: Observable<string>;

    setTranslate(): void {
      this.translate$ = this.chart.ranges$.pipe(
        map((ranges) => {
          const translate = this.getTranslateDistance(ranges);
          return `translate(0, ${translate})`;
        })
      );
    }

    getTranslateDistance(ranges: Ranges): number {
      return this.config.side === 'top'
        ? this.getTopTranslate(ranges)
        : this.getBottomTranslate(ranges);
    }

    getTopTranslate(ranges: Ranges): number {
      return ranges.y[1];
    }

    getBottomTranslate(ranges: Ranges): number {
      return ranges.y[0] - ranges.y[1] + this.chart.margin.top;
    }

    getScale(): Observable<XyAxisScale> {
      const scales$ = this.chart.scales$.pipe(
        filter((scales) => !!scales && !!scales.x),
        map((scales) => {
          return { scale: scales.x, useTransition: scales.useTransition };
        })
      );
      return scales$;
    }

    setAxisFunction(): void {
      this.axisFunction = this.config.side === 'top' ? axisTop : axisBottom;
    }
  }

  return Mixin;
}
