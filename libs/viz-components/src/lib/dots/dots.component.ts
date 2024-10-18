import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectionToken,
  NgZone,
} from '@angular/core';
import { select, Transition } from 'd3';
import { ChartComponent } from '../charts/chart/chart.component';
import {
  XyChartComponent,
  XyChartScales,
} from '../charts/xy-chart/xy-chart.component';
import { GenericScale } from '../core';
import { VIC_PRIMARY_MARKS } from '../marks/primary-marks/primary-marks';
import { VicXyPrimaryMarks } from '../marks/xy-marks/xy-primary-marks/xy-primary-marks';
import { DotsConfig } from './config/dots-config';

export const DOTS = new InjectionToken<DotsComponent<unknown>>('DotsComponent');

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-primary-marks-dots]',
  templateUrl: './dots.component.html',
  styleUrl: './dots.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_PRIMARY_MARKS, useExisting: DotsComponent },
    { provide: DOTS, useExisting: DotsComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
})
export class DotsComponent<Datum> extends VicXyPrimaryMarks<
  Datum,
  DotsConfig<Datum>
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dotGroups: any;
  private zone = inject(NgZone);
  private elRef = inject(ElementRef);
  override scales: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fill: GenericScale<any, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    radius: GenericScale<any, any>;
  } & XyChartScales = {
    fill: undefined,
    radius: undefined,
    x: undefined,
    y: undefined,
    useTransition: undefined,
  };

  setChartScalesFromRanges(useTransition: boolean): void {
    const x = this.config.x.getScaleFromRange(this.ranges.x);
    const y = this.config.y.getScaleFromRange(this.ranges.y);
    this.scales.fill = this.config.fill.getScale();
    this.scales.radius = this.config.radius.getScale();
    this.zone.run(() => {
      this.chart.updateScales({ x, y, useTransition });
    });
  }

  drawMarks(): void {
    const transitionDuration = this.getTransitionDuration();
    this.drawDots(transitionDuration);
  }

  drawDots(transitionDuration: number): void {
    const t = select(this.elRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.dotGroups = select(this.elRef.nativeElement)
      .selectAll('vic-dot-group')
      .data(this.config.valueIndices)
      .join(
        (enter) => enter.append('g').attr('class', 'vic-dot-group'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (update) => update.transition(t as any),
        (exit) => exit.remove()
      );

    this.dotGroups
      .selectAll('.vic-dot')
      .data((d) => [d])
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('class', 'vic-dot')
            .attr('cx', (i) => this.scales.x(this.config.x.values[i]))
            .attr('cy', (i) => this.scales.y(this.config.y.values[i]))
            .attr('r', (i) => this.scales.radius(this.config.radius.values[i]))
            .attr('fill', (i) => this.scales.fill(this.config.fill.values[i]))
            .attr('stroke', 'none')
            .attr('stroke-width', this.config.stroke.width),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr('cx', (i) => this.scales.x(this.config.x.values[i]))
            .attr('cy', (i) => this.scales.y(this.config.y.values[i]))
            .attr('r', (i) => this.scales.radius(this.config.radius.values[i]))
            .attr('fill', (i) => this.scales.fill(this.config.fill.values[i]))
            .attr(
              'stroke',
              this.config.stroke ? this.config.stroke.color : 'none'
            )
            .attr(
              'stroke-width',
              this.config.stroke ? this.config.stroke.width : null
            )
            .attr(
              'stroke-dasharray',
              this.config.stroke ? this.config.stroke.dasharray : null
            )
            .attr(
              'stroke-linecap',
              this.config.stroke ? this.config.stroke.linecap : null
            )
            .attr(
              'stroke-linejoin',
              this.config.stroke ? this.config.stroke.linejoin : null
            ),
        (exit) => exit.remove()
      );
  }
}
