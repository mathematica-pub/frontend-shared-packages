import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectionToken,
  NgZone,
} from '@angular/core';
import { select } from 'd3';
import { Selection } from 'd3-selection';
import { BehaviorSubject } from 'rxjs';
import { ChartComponent } from '../charts/chart/chart.component';
import {
  XyChartComponent,
  XyChartScales,
} from '../charts/xy-chart/xy-chart.component';
import { GenericScale } from '../core';
import { ValueUtilities } from '../core/utilities/values';
import { VIC_PRIMARY_MARKS } from '../marks/primary-marks/primary-marks';
import { VicXyPrimaryMarks } from '../marks/xy-marks/xy-primary-marks/xy-primary-marks';
import { DotsConfig } from './config/dots-config';
import { DotsTooltipData } from './events/dots-event-output';

export const DOTS = new InjectionToken<DotsComponent<unknown>>('DotsComponent');

export type DotGroupSelection = Selection<
  SVGGElement,
  DotDatum,
  SVGGElement,
  unknown
>;
export type DotSelection = Selection<
  SVGCircleElement,
  DotDatum,
  SVGGElement,
  DotDatum
>;
export type DotLabelSelection = Selection<
  SVGTextElement,
  DotDatum,
  SVGGElement,
  DotDatum
>;

export type DotDatum = {
  index: number;
  x: number | Date;
  y: number;
  fill: string | number;
  radius: string | number;
};

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
  dotGroups: DotGroupSelection;
  dots: BehaviorSubject<DotSelection> = new BehaviorSubject(null);
  dots$ = this.dots.asObservable();
  dotLabels: BehaviorSubject<DotLabelSelection> = new BehaviorSubject(null);
  dotLabels$ = this.dotLabels.asObservable();
  private zone = inject(NgZone);
  private elRef = inject<ElementRef<SVGGElement>>(ElementRef);
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
      this.chart.updateScales({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        x: x as unknown as GenericScale<any, any>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        y: y as unknown as GenericScale<any, any>,
        useTransition,
      });
    });
  }

  drawMarks(): void {
    const transitionDuration = this.getTransitionDuration();
    this.drawDots(transitionDuration);
    this.updateDotElements();
  }

  drawDots(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration);

    this.dotGroups = select(this.elRef.nativeElement)
      .selectAll<SVGGElement, DotDatum>('vic-dot-group')
      .data<DotDatum>(
        this.config.valueIndices.map((i) => this.getDotDatumFromIndex(i))
      )
      .join(
        (enter) =>
          enter
            .append('g')
            .attr('class', 'vic-dot-group')
            .attr(
              'transform',
              (d) => `translate(${this.scales.x(d.x)}, ${this.scales.y(d.y)})`
            ),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr(
              'transform',
              (d) => `translate(${this.scales.x(d.x)}, ${this.scales.y(d.y)})`
            ),
        (exit) => exit.remove()
      );

    this.dotGroups
      .selectAll<SVGCircleElement, DotDatum>('.vic-dot')
      .data<DotDatum>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('class', 'vic-dot')
            .attr('r', (d) => this.scales.radius(d.radius))
            .attr('fill', (d) => this.scales.fill(d.fill))
            .attr(
              'stroke',
              this.config.stroke ? this.config.stroke.color : 'none'
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
            )
            .attr(
              'stroke-opacity',
              this.config.stroke ? this.config.stroke.opacity : null
            )
            .attr(
              'stroke-width',
              this.config.stroke ? this.config.stroke.width : null
            ),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr('r', (d) => this.scales.radius(d.radius))
            .attr('fill', (d) => this.scales.fill(d.fill))
            .attr(
              'stroke',
              this.config.stroke ? this.config.stroke.color : 'none'
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
            )
            .attr(
              'stroke-opacity',
              this.config.stroke ? this.config.stroke.opacity : null
            )
            .attr(
              'stroke-width',
              this.config.stroke ? this.config.stroke.width : null
            ),
        (exit) => exit.remove()
      );
  }

  getDotDatumFromIndex(index: number): DotDatum {
    return {
      index,
      x: this.config.x.values[index],
      y: this.config.y.values[index],
      fill: this.config.fill.values[index],
      radius: this.config.radius.values[index],
    };
  }

  updateDotElements(): void {
    const dots = select(this.elRef.nativeElement).selectAll<
      SVGCircleElement,
      DotDatum
    >('.vic-dot');
    const dotLabels = select(this.elRef.nativeElement).selectAll<
      SVGTextElement,
      DotDatum
    >('.vic-dot-label');
    this.dots.next(dots);
    this.dotLabels.next(dotLabels);
  }

  getTooltipData(
    dotDatum: DotDatum,
    elRef: ElementRef
  ): DotsTooltipData<Datum> {
    const datum = this.getUserDatumFromDotsDatum(dotDatum);
    const valueFill = this.config.fill.valueAccessor(datum);
    const tooltipData: DotsTooltipData<Datum> = {
      datum,
      values: {
        fill: valueFill,
        radius: this.config.radius.valueAccessor(datum),
        x: this.config.x.formatFunction
          ? ValueUtilities.customFormat(datum, this.config.x.formatFunction)
          : ValueUtilities.d3Format(
              this.config.x.valueAccessor(datum),
              this.config.x.formatSpecifier
            ),
        y: this.config.y.formatFunction
          ? ValueUtilities.customFormat(datum, this.config.y.formatFunction)
          : ValueUtilities.d3Format(
              this.config.y.valueAccessor(datum),
              this.config.y.formatSpecifier
            ),
      },
      color: this.scales.fill(valueFill),
      elRef: elRef,
    };
    return tooltipData;
  }

  getUserDatumFromDotsDatum(dotDatum: DotDatum): Datum {
    return this.config.data.find(
      (d) =>
        this.config.x.values[dotDatum.index] ===
          this.config.x.valueAccessor(d) &&
        this.config.y.values[dotDatum.index] ===
          this.config.y.valueAccessor(d) &&
        this.config.fill.values[dotDatum.index] ===
          this.config.fill.valueAccessor(d) &&
        this.config.radius.values[dotDatum.index] ===
          this.config.radius.valueAccessor(d)
    );
  }
}
