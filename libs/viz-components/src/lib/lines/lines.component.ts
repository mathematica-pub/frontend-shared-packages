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
import { area, line, map, select, Transition } from 'd3';
import { Selection } from 'd3-selection';
import { ChartComponent } from '../charts/chart/chart.component';
import { XyChartComponent } from '../charts/xy-chart/xy-chart.component';
import { GenericScale } from '../core';
import { ValueUtilities } from '../core/utilities/values';
import { VIC_PRIMARY_MARKS } from '../marks/primary-marks/primary-marks';
import { VicXyPrimaryMarks } from '../marks/xy-marks/xy-primary-marks/xy-primary-marks';
import { LinesConfig, LinesMarkerDatum } from './config/lines-config';
import { LinesEventOutput } from './events/lines-event-output';

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

export interface LinesTooltipDatum<Datum> {
  datum: Datum;
  color: string;
  values: {
    x: string;
    y: string;
    color: string;
  };
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-primary-marks-lines]',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_PRIMARY_MARKS, useExisting: LinesComponent },
    { provide: LINES, useExisting: LinesComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
})
export class LinesComponent<Datum> extends VicXyPrimaryMarks<
  Datum,
  LinesConfig<Datum>
> {
  @ViewChild('lines', { static: true }) linesRef: ElementRef<SVGSVGElement>;
  @ViewChild('dot', { static: true }) dotRef: ElementRef<SVGSVGElement>;
  @ViewChild('markers', { static: true }) markersRef: ElementRef<SVGSVGElement>;
  @ViewChild('lineLabels', { static: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  line: (x: any[]) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lineArea: (x: any[]) => any;
  lineGroups: LinesGroupSelection;
  lineLabelsRef: ElementRef<SVGSVGElement>;
  markerClass = 'vic-lines-datum-marker';
  markerIndexAttr = 'index';
  private zone = inject(NgZone);

  setChartScalesFromRanges(useTransition: boolean): void {
    const x = this.config.x.getScaleFromRange(this.ranges.x);
    const y = this.config.y.getScaleFromRange(this.ranges.y);
    const categorical = this.config.color.getScale();
    this.chart.updateScales({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      x: x as unknown as GenericScale<any, any>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y: y as unknown as GenericScale<any, any>,
      categorical,
      useTransition,
    });
  }

  drawMarks(): void {
    this.setLine();
    const transitionDuration = this.getTransitionDuration();
    this.drawLines(transitionDuration);
    if (this.config.areaFills) {
      this.setBelowLineFills();
      this.drawBelowLineFills(transitionDuration);
    }
    if (this.config.pointMarkers) {
      this.drawPointMarkers(transitionDuration);
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

  setBelowLineFills(): void {
    const isValid = map(this.config.data, this.isValidValue.bind(this));

    this.lineArea = area()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .defined((i: any) => isValid[i] as boolean)
      .curve(this.config.curve)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .x((i: any) => this.scales.x(this.config.x.values[i]))
      .y0(() => this.scales.y(0))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .y1((i: any) => this.scales.y(this.config.y.values[i]));
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

  drawBelowLineFills(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.lineGroups
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>('.vic-line-area')
      .data<LinesGroupSelectionDatum>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('category', ([category]) => category)
            .attr('fill', ([category, indices]) =>
              this.getAreaFill(category, indices)
            )
            .attr('class', 'vic-line-area')
            .attr('opacity', this.config.areaFills.opacity)
            .attr('d', ([, lineData]) => this.lineArea(lineData))
            .attr('display', this.config.areaFills.display ? null : 'none'),
        (update) =>
          update
            .attr('category', ([category]) => category)
            .attr('fill', ([category, indices]) =>
              this.getAreaFill(category, indices)
            )
            .attr('opacity', this.config.areaFills.opacity)
            .call((update) =>
              update
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .transition(t as any)
                .attr('d', ([, lineData]) => this.lineArea(lineData))
            )
            .attr('display', this.config.areaFills.display ? null : 'none'),
        (exit) => exit.remove()
      );
  }

  getAreaFill(category: string, lineDataIndices: number[]): string {
    const firstPointInLine = this.config.data[lineDataIndices[0]];
    if (this.config.areaFills.fillDefs) {
      const fillDef = this.config.areaFills.fillDefs.find((def) =>
        def.useDef(firstPointInLine)
      );
      if (fillDef) {
        return `url(#${fillDef.name})`;
      } else {
        return null;
      }
    }
    if (this.config.areaFills.color) {
      return this.config.areaFills.color(firstPointInLine);
    }
    return this.scales.categorical(category);
  }

  drawPointMarkers(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.lineGroups
      .selectAll<SVGCircleElement, LinesMarkerDatum>('circle')
      .data<LinesMarkerDatum>(([, indices]) =>
        this.config.getPointMarkersData(indices)
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
              this.scales.categorical(this.config.color.values[d.index])
            )
            .style('display', (d) => d.display),
        (update) =>
          update
            .attr('fill', (d) =>
              this.scales.categorical(this.config.color.values[d.index])
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
              this.scales.categorical(this.config.color.values[d.index])
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
              this.scales.categorical(this.config.color.values[d.index])
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

  getTooltipData(datumIndex: number): LinesEventOutput<Datum> {
    const datum = this.config.data[datumIndex];
    return {
      datum,
      color: this.scales.categorical(this.config.color.valueAccessor(datum)),
      values: {
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
        color: this.config.color.valueAccessor(datum),
      },
      positionX: this.scales.x(this.config.x.values[datumIndex]),
      positionY: this.scales.y(this.config.y.values[datumIndex]),
    };
  }
}
