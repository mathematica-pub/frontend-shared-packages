import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectionToken,
  NgZone,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { line, map, select, Transition } from 'd3';
import { Selection } from 'd3-selection';
import { ChartComponent } from '../chart/chart.component';
import { VIC_DATA_MARKS } from '../data-marks/data-marks-base';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { VicXyDataMarks } from '../xy-data-marks/xy-data-marks';
import { LinesConfig, LinesMarkerDatum } from './config/lines-config';

export type LinesGroupSelection = Selection<
  SVGGElement,
  LinesGroupSelectionDatum,
  SVGSVGElement,
  unknown
>;

export type LinesGroupSelectionDatum = [string, number[]];

export const LINES = new InjectionToken<LinesComponent<unknown>>(
  'LinesComponent'
);

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-lines]',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_DATA_MARKS, useExisting: LinesComponent },
    { provide: LINES, useExisting: LinesComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
})
export class LinesComponent<Datum> extends VicXyDataMarks<
  Datum,
  LinesConfig<Datum>
> {
  @ViewChild('lines', { static: true }) linesRef: ElementRef<SVGSVGElement>;
  @ViewChild('dot', { static: true }) dotRef: ElementRef<SVGSVGElement>;
  @ViewChild('markers', { static: true }) markersRef: ElementRef<SVGSVGElement>;
  @ViewChild('lineLabels', { static: true })
  hoverDotClass = 'vic-lines-hover-dot';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  line: (x: any[]) => any;
  lineGroups: LinesGroupSelection;
  lineLabelsRef: ElementRef<SVGSVGElement>;
  markerClass = 'vic-lines-datum-marker';
  markerIndexAttr = 'index';
  private zone = inject(NgZone);

  setChartScalesFromRanges(useTransition: boolean): void {
    const x = this.config.x.getScaleFromRange(this.ranges.x);
    const y = this.config.y.getScaleFromRange(this.ranges.y);
    const categorical = this.config.categorical.getScale();
    this.zone.run(() => {
      this.chart.updateScales({ x, y, categorical, useTransition });
    });
  }

  drawMarks(): void {
    this.setLine();
    const transitionDuration = this.getTransitionDuration();
    this.drawLines(transitionDuration);
    if (this.config.pointMarkers) {
      this.drawPointMarkers(transitionDuration);
    } else if (this.config.hoverDot) {
      this.drawHoverDot();
    }
    if (this.config.labelLines) {
      this.drawLineLabels();
    }
  }

  setLine(): void {
    const isValid = map(this.config.data, this.isValidValue.bind(this));

    this.line = line()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .defined((i: any) => isValid[i] as boolean)
      .curve(this.config.curve)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .x((i: any) => this.scales.x(this.config.x.values[i]))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .y((i: any) => this.scales.y(this.config.y.values[i]));
  }

  isValidValue(d: Datum): boolean {
    const xIsValid = this.config.x.isValidValue(this.config.x.valueAccessor(d));
    const yIsValid = this.config.y.isValidValue(this.config.y.valueAccessor(d));
    return xIsValid && yIsValid;
  }

  drawLines(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.lineGroups = select(this.linesRef.nativeElement)
      .selectAll<SVGGElement, LinesGroupSelectionDatum>('.vic-line-group')
      .data<LinesGroupSelectionDatum>(
        this.config.linesD3Data,
        this.config.linesKeyFunction
      )
      .join(
        (enter) => enter.append('g').attr('class', 'vic-line-group'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (update) => update.transition(t as any),
        (exit) => exit.remove()
      );

    this.lineGroups
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('.vic-line')
      .data<LinesGroupSelectionDatum>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('category', ([category]) => category)
            .attr('class', 'vic-line')
            .attr('stroke', ([category]) => this.scales.categorical(category))
            .attr('d', ([, lineData]) => this.line(lineData)),
        (update) =>
          update
            .attr('category', ([category]) => category)
            .attr('stroke', ([category]) => this.scales.categorical(category))
            .call((update) =>
              update
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .transition(t as any)
                .attr('d', ([, lineData]) => this.line(lineData))
            ),
        (exit) => exit.remove()
      );
  }

  drawHoverDot(): void {
    select(this.dotRef.nativeElement)
      .append('circle')
      .attr('class', `${this.config.hoverDot.class} ${this.hoverDotClass}`)
      .attr('r', this.config.hoverDot.radius)
      .attr('fill', '#222')
      .attr('display', 'none');
  }

  drawPointMarkers(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.lineGroups
      .selectAll<SVGCircleElement, LinesMarkerDatum>('circle')
      .data<LinesMarkerDatum>(([, indices]) =>
        this.config.getMarkersData(indices)
      )
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr(
              'class',
              `${this.config.pointMarkers.class} ${this.markerClass}`
            )
            .attr('key', (d) => d.key)
            .attr('category', (d) => d.category)
            .attr(this.markerIndexAttr, (d) => d.index)
            .attr('cx', (d) => this.scales.x(this.config.x.values[d.index]))
            .attr('cy', (d) => this.scales.y(this.config.y.values[d.index]))
            .attr('r', this.config.pointMarkers.radius)
            .attr('fill', (d) =>
              this.scales.categorical(this.config.categorical.values[d.index])
            ),
        (update) =>
          update
            .attr('fill', (d) =>
              this.scales.categorical(this.config.categorical.values[d.index])
            )
            .call((update) =>
              update
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .transition(t as any)
                .attr('cx', (d) => this.scales.x(this.config.x.values[d.index]))
                .attr('cy', (d) => this.scales.y(this.config.y.values[d.index]))
            ),
        (exit) => exit.remove()
      );
  }

  drawLineLabels(): void {
    // TODO: make more flexible (or its own element? currently this only puts labels on the right side of the chart
    this.lineGroups
      .selectAll('text')
      .data(([category, indices]) => {
        return [
          {
            category,
            index: indices[indices.length - 1],
          },
        ];
      })
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('class', 'vic-line-label')
            .attr('text-anchor', 'end')
            .attr('fill', (d) =>
              this.scales.categorical(this.config.categorical.values[d.index])
            )
            .attr(
              'x',
              (d) => `${this.scales.x(this.config.x.values[d.index]) - 4}px`
            )
            .attr(
              'y',
              (d) => `${this.scales.y(this.config.y.values[d.index]) - 12}px`
            )
            .text((d) => this.config.lineLabelsFormat(d.category)),
        (update) =>
          update
            .attr('fill', (d) =>
              this.scales.categorical(this.config.categorical.values[d.index])
            )
            .attr(
              'x',
              (d) => `${this.scales.x(this.config.x.values[d.index]) - 4}px`
            )
            .attr(
              'y',
              (d) => `${this.scales.y(this.config.y.values[d.index]) - 12}px`
            )
            .text((d) => this.config.lineLabelsFormat(d.category)),
        (exit) => exit.remove()
      );
  }
}
