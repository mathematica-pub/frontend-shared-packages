import { Directive, Input } from '@angular/core';
import { axisBottom, axisTop } from 'd3';
import { Observable, filter, map } from 'rxjs';
import { Ranges } from '../../chart/chart.component';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { VicSide } from '../../core/types/layout';
import { VicDataValue } from '../../core/types/values';
import { XyAxis, XyAxisScale } from '../xy-axis';
import { VicXAxisConfig } from './x-axis.config';

/**
 * A mixin that extends `XyAxis` with the functionality needed for an x-axis.
 *
 * For internal library use only.
 */
export function mixinXAxis<
  TickValue extends VicDataValue,
  T extends AbstractConstructor<XyAxis<TickValue>>
>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    @Input() override config: VicXAxisConfig<TickValue>;
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
      return this.config.side === VicSide.top
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
      this.axisFunction =
        this.config.side === VicSide.top ? axisTop : axisBottom;
    }
  }

  return Mixin;
}
