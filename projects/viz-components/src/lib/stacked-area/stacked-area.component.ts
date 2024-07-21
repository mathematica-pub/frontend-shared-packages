import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  NgZone,
} from '@angular/core';
import { Transition, area, select } from 'd3';
import { DataValue } from '../core/types/values';
import { VIC_DATA_MARKS } from '../data-marks/data-marks-base';
import { VicXyDataMarks } from '../xy-data-marks/xy-data-marks';
import { StackedAreaConfig } from './config/stacked-area-config';

// Ideally we would be able to use generic T with the component, but Angular doesn't yet support this, so we use unknown instead
// https://github.com/angular/angular/issues/46815, https://github.com/angular/angular/pull/47461
export const STACKED_AREA = new InjectionToken<
  StackedAreaComponent<unknown, DataValue>
>('StackedAreaComponent');

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-stacked-area]',
  templateUrl: './stacked-area.component.html',
  styleUrls: ['./stacked-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_DATA_MARKS, useExisting: StackedAreaComponent },
    { provide: STACKED_AREA, useExisting: StackedAreaComponent },
  ],
})
export class StackedAreaComponent<
  Datum,
  TCategoricalValue extends DataValue
> extends VicXyDataMarks<Datum, StackedAreaConfig<Datum, TCategoricalValue>> {
  area;
  areas;

  constructor(
    private areasRef: ElementRef<SVGSVGElement>,
    private zone: NgZone
  ) {
    super();
  }

  setPropertiesFromRanges(useTransition: boolean): void {
    const x = this.config.x.getScaleFromRange(this.ranges.x);
    const y = this.config.y.getScaleFromRange(this.ranges.y);
    const categorical = this.config.categorical.getScale();
    this.zone.run(() => {
      this.chart.updateScales({ x, y, categorical, useTransition });
    });
  }

  drawMarks(): void {
    const transitionDuration = this.getTransitionDuration();
    this.setArea();
    this.drawAreas(transitionDuration);
  }

  setArea(): void {
    this.area = area()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .x(({ i }: any) => this.scales.x(this.config.x.values[i]))
      .y0(([y1]) => this.scales.y(y1))
      .y1(([, y2]) => this.scales.y(y2))
      .curve(this.config.curve);
  }

  drawAreas(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.areas = select(this.areasRef.nativeElement)
      .selectAll('path')
      .data(this.config.series)
      .join(
        (enter) =>
          enter
            .append('path')
            .property('key', ([{ i }]) => this.config.categorical.values[i])
            .attr('fill', ([{ i }]) =>
              this.scales.categorical(this.config.categorical.values[i])
            )
            .attr('d', this.area),
        (update) =>
          update.call((update) =>
            update
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .transition(t as any)
              .attr('d', this.area)
              .attr('fill', ([{ i }]) =>
                this.scales.categorical(this.config.categorical.values[i])
              )
          ),
        (exit) => exit.remove()
      );
  }
}
