import { Directive, Input } from '@angular/core';
import { axisLeft, axisRight } from 'd3';
import { Observable, filter, map } from 'rxjs';
import { Ranges } from '../../chart/chart.component';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { VicSide } from '../../core/types/layout';
import { XyAxis, XyAxisScale } from '../xy-axis';

/**
 * A mixin that extends `XyAxis` with the functionality needed for a y-axis.
 *
 * For internal library use only.
 */
export function mixinYAxis<T extends AbstractConstructor<XyAxis>>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    /**
     * The side of the chart on which the axis will be rendered.
     */
    @Input() side: VicSide.left | VicSide.right = VicSide.left;
    translate$: Observable<string>;

    setTranslate(): void {
      this.translate$ = this.chart.ranges$.pipe(
        map((ranges) => {
          const translate = this.getTranslateDistance(ranges);
          return `translate(${translate}, 0)`;
        })
      );
    }

    getTranslateDistance(ranges: Ranges): number {
      return this.side === VicSide.left
        ? this.getLeftTranslate(ranges)
        : this.getRightTranslate(ranges);
    }

    getLeftTranslate(ranges: Ranges): number {
      return ranges.x[0];
    }

    getRightTranslate(ranges: Ranges): number {
      return ranges.x[1] + this.chart.margin.right;
    }

    getScale(): Observable<XyAxisScale> {
      const scales$ = this.chart.scales$.pipe(
        filter((scales) => !!scales && !!scales.y),
        map((scales) => {
          return { scale: scales.y, useTransition: scales.useTransition };
        })
      );
      return scales$;
    }

    setAxisFunction(): void {
      this.axisFunction = this.side === VicSide.left ? axisLeft : axisRight;
    }

    initNumTicks(): number {
      const d3ExampleDefault = this.chart.height / 50;
      if (d3ExampleDefault < 1) {
        return 1;
      } else {
        return Math.floor(d3ExampleDefault);
      }
    }
  }

  return Mixin;
}
