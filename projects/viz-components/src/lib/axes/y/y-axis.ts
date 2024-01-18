import { Directive, Input } from '@angular/core';
import { axisLeft, axisRight } from 'd3';
import { Observable, filter, map } from 'rxjs';
import { Ranges } from '../../chart/chart.component';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { XyAxis } from '../xy-axis';

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
    @Input() side: 'left' | 'right' = 'left';
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
      return this.side === 'left'
        ? this.getLeftTranslate(ranges)
        : this.getRightTranslate(ranges);
    }

    getLeftTranslate(ranges: Ranges): number {
      return ranges.x[0];
    }

    getRightTranslate(ranges: Ranges): number {
      return ranges.x[1] - ranges.x[0] - this.chart.margin.right;
    }

    setScale(): void {
      const scales$ = this.chart.scales$.pipe(
        filter((scales) => !!scales && !!scales.y),
        map((scales) => {
          return { y: scales.y, useTransition: scales.useTransition };
        })
      );
      this.subscribeToScale(scales$);
    }

    setAxisFunction(): void {
      this.axisFunction = this.side === 'left' ? axisLeft : axisRight;
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
