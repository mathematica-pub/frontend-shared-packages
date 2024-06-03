/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { ChartComponent } from '../chart/chart.component';
import { VIC_DATA_MARKS } from '../data-marks/data-marks';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { VicXyDataMarks } from '../xy-data-marks/xy-data-marks';
import { VicLinesConfig } from './config/lines.config';

export interface Marker {
  key: string;
  index: number;
}

export class LinesTooltipData {
  datum: any;
  color: string;
  x: string;
  y: string;
  categorical: string;
}

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
  VicLinesConfig<Datum>
> {
  @ViewChild('lines', { static: true }) linesRef: ElementRef<SVGSVGElement>;
  @ViewChild('dot', { static: true }) dotRef: ElementRef<SVGSVGElement>;
  @ViewChild('markers', { static: true }) markersRef: ElementRef<SVGSVGElement>;
  @ViewChild('lineLabels', { static: true })
  lineLabelsRef: ElementRef<SVGSVGElement>;
  line: (x: any[]) => any;
  markerClass = 'vic-lines-datum-marker';
  markerIndexAttr = 'index';

  private zone = inject(NgZone);

  get lines(): any {
    return select(this.linesRef.nativeElement).selectAll('path');
  }

  get hoverDot(): any {
    return select(this.dotRef.nativeElement).selectAll('circle');
  }

  get markers(): any {
    return select(this.markersRef.nativeElement).selectAll('circle');
  }

  setPropertiesFromRanges(useTransition: boolean): void {
    const x = this.config.x.getScaleFromRange(this.ranges.x);
    const y = this.config.y.getScaleFromRange(this.ranges.y);
    const categorical = this.config.categorical.scale;
    this.zone.run(() => {
      this.chart.updateScales({ x, y, categorical, useTransition });
    });
  }

  drawMarks(): void {
    this.setLine();
    const transitionDuration = this.getTransitionDuration();
    this.drawLines(transitionDuration);
    if (this.config.pointMarkers.display) {
      this.drawPointMarkers(transitionDuration);
    } else if (this.config.hoverDot.display) {
      this.drawHoverDot();
    }
    if (this.config.labelLines) {
      this.drawLineLabels();
    }
  }

  setLine(): void {
    if (this.config.valueIsDefined === undefined) {
      this.config.valueIsDefined = (d, i) =>
        this.config.canBeDrawnByPath(this.config.x.values[i]) &&
        this.config.canBeDrawnByPath(this.config.y.values[i]);
    }
    const isDefinedValues = map(this.config.data, this.config.valueIsDefined);

    this.line = line()
      .defined((i: any) => isDefinedValues[i] as boolean)
      .curve(this.config.curve)
      .x((i: any) => this.scales.x(this.config.x.values[i]))
      .y((i: any) => this.scales.y(this.config.y.values[i]));
  }

  drawLines(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.lines.data(this.config.linesD3Data, this.config.linesKeyFunction).join(
      (enter) =>
        enter
          .append('path')
          .attr('key', ([category]) => category)
          .attr('class', 'vic-line')
          .attr('stroke', ([category]) => this.scales.categorical(category))
          .attr('d', ([, lineData]) => this.line(lineData)),
      (update) =>
        update
          .attr('stroke', ([category]) => this.scales.categorical(category))
          .call((update) =>
            update
              .transition(t as any)
              .attr('d', ([, lineData]) => this.line(lineData))
          ),
      (exit) => exit.remove()
    );
  }

  drawHoverDot(): void {
    select(this.dotRef.nativeElement)
      .append('circle')
      .attr('class', 'vic-tooltip-dot')
      .attr('r', this.config.hoverDot.radius)
      .attr('fill', '#222')
      .attr('display', 'none');
  }

  drawPointMarkers(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.markers
      .data(this.config.markersD3Data, this.config.markersKeyFunction)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('class', this.markerClass)
            .attr('key', (d) => d.key)
            .attr(this.markerIndexAttr, (d) => d.index)
            .style('mix-blend-mode', this.config.mixBlendMode)
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
                .transition(t as any)
                .attr('cx', (d) => this.scales.x(this.config.x.values[d.index]))
                .attr('cy', (d) => this.scales.y(this.config.y.values[d.index]))
            ),
        (exit) => exit.remove()
      );
  }

  drawLineLabels(): void {
    const lastPoints = [];
    this.config.linesD3Data.forEach((values, key) => {
      const lastPoint = values[values.length - 1];
      lastPoints.push({ category: key, index: lastPoint });
    });
    // TODO: make more flexible (or its own element? currently this only puts labels on the right side of the chart
    select(this.lineLabelsRef.nativeElement)
      .selectAll('text')
      .data(lastPoints)
      .join('text')
      .attr('class', 'vic-line-label')
      .attr('text-anchor', 'end')
      .attr('fill', (d) =>
        this.scales.categorical(this.config.categorical.values[d.index])
      )
      .attr('x', (d) => `${this.scales.x(this.config.x.values[d.index]) - 4}px`)
      .attr(
        'y',
        (d) => `${this.scales.y(this.config.y.values[d.index]) - 12}px`
      )
      .text((d) => this.config.lineLabelsFormat(d.category));
  }
}
