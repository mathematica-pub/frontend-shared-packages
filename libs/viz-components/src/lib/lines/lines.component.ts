import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectionToken,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import { area, line, map, select, Transition } from 'd3';
import { Selection } from 'd3-selection';
import { ChartComponent } from '../charts/chart/chart.component';
import {
  XyChartComponent,
  XyChartScales,
} from '../charts/xy-chart/xy-chart.component';
import { GenericScale } from '../core/types/scale';
import { DataValue } from '../core/types/values';
import { ValueUtilities } from '../core/utilities/values';
import { VIC_PRIMARY_MARKS } from '../marks/primary-marks/primary-marks';
import { VicXyPrimaryMarks } from '../marks/xy-marks/xy-primary-marks/xy-primary-marks';
import { LinesConfig, LinesMarkerDatum } from './config/lines-config';
import { LinesEventOutput } from './events/lines-event-output';

export type LinesGroupSelection = Selection<
  SVGGElement,
  LinesGroupSelectionDatum,
  SVGGElement,
  unknown
>;

export type LinesGroupSelectionDatum = [string, number[]];

export const LINES = new InjectionToken<LinesComponent<unknown, DataValue>>(
  'LinesComponent'
);

export interface LinesTooltipDatum<Datum> {
  datum: Datum;
  color: string;
  values: {
    x: string;
    y: string;
    strokeColor: string;
  };
}

type LinesSvgElements = 'g' | 'line' | 'area' | 'marker' | 'label';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-primary-marks-lines]',
  template: '',
  styleUrls: ['./lines.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_PRIMARY_MARKS, useExisting: LinesComponent },
    { provide: LINES, useExisting: LinesComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
  host: {
    '[class]': 'config.marksClass',
    '[attr.stroke-linecap]': 'config.stroke.linecap',
    '[attr.stroke-linejoin]': 'config.stroke.linejoin',
    '[attr.stroke-width]': 'config.stroke.width',
    '[attr.stroke-opacity]': 'config.stroke.opacity',
    '[style.mix-blend-mode]': 'config.mixBlendMode',
    fill: 'none',
  },
})
export class LinesComponent<
  Datum,
  ChartMultipleDomain extends DataValue = string,
> extends VicXyPrimaryMarks<
  Datum,
  ChartMultipleDomain,
  LinesConfig<Datum, ChartMultipleDomain>
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  line: (x: any[]) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lineArea: (x: any[]) => any;
  lineGroups: LinesGroupSelection;
  lineLabelsRef: ElementRef<SVGSVGElement>;
  markerIndexAttr = 'index';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override scales: { color: GenericScale<any, any> } & XyChartScales = {
    multiple: undefined,
    x: undefined,
    y: undefined,
    color: undefined,
    useTransition: undefined,
  };
  private zone = inject(NgZone);
  private elRef = inject<ElementRef<SVGGElement>>(ElementRef);

  get class(): Record<LinesSvgElements, string> {
    return {
      g: this.config.marksClass + '-group',
      line: this.config.marksClass + '-line',
      area: this.config.marksClass + '-area',
      marker: this.config.marksClass + '-marker',
      label: this.config.marksClass + '-label',
    };
  }

  setChartScalesFromRanges(useTransition: boolean): void {
    const x = this.config.x.getScaleFromRange(this.ranges.x);
    const y = this.config.y.getScaleFromRange(this.ranges.y);
    this.scales.color = this.config.stroke.color.getScale();
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
    this.setLine();
    const transitionDuration = this.getTransitionDuration();
    this.drawLines(transitionDuration);
    if (this.config.areaFills) {
      this.setAreaFunction();
      this.drawAreaFills(transitionDuration);
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

  setAreaFunction(): void {
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

    this.lineGroups = select(this.elRef.nativeElement)
      .selectAll<SVGGElement, LinesGroupSelectionDatum>(`.${this.class.g}`)
      .data<LinesGroupSelectionDatum>(
        this.config.linesD3Data,
        this.config.linesKeyFunction
      )
      .join(
        (enter) => enter.append('g').attr('class', this.class.g),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (update) => update.transition(t as any),
        (exit) => exit.remove()
      );

    this.lineGroups
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>(
        `.${this.class.line}`
      )
      .data<LinesGroupSelectionDatum>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('class', ([category], i) =>
              `${this.class.line} ${this.config.datumClass(this.config.getDataFromCategory(category)[0], i)}`.trim()
            )
            .attr('stroke', ([category]) => this.scales.color(category))
            .attr('d', ([, lineData]) => this.line(lineData)),
        (update) =>
          update
            .attr('stroke', ([category]) => this.scales.color(category))
            .call((update) =>
              update
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .transition(t as any)
                .attr('d', ([, lineData]) => this.line(lineData))
            ),
        (exit) => exit.remove()
      );
  }

  drawAreaFills(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.lineGroups
      .selectAll<SVGPathElement, LinesGroupSelectionDatum>(
        `.${this.class.area}`
      )
      .data<LinesGroupSelectionDatum>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('class', this.class.area)
            .attr('fill', ([category, indices]) =>
              this.getAreaFill(category, indices)
            )
            .attr('opacity', this.config.areaFills.opacity)
            .attr('d', ([, lineData]) => this.lineArea(lineData))
            .attr('display', this.config.areaFills.display ? null : 'none'),
        (update) =>
          update
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
    if (this.config.areaFills.customFills) {
      const fillDef = this.config.areaFills.customFills.find((def) =>
        def.shouldApply(firstPointInLine)
      );
      if (fillDef) {
        return `url(#${fillDef.defId})`;
      } else {
        return null;
      }
    }
    if (this.config.areaFills.color) {
      return this.config.areaFills.color(firstPointInLine);
    }
    return this.scales.color(category);
  }

  drawPointMarkers(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.lineGroups
      .selectAll<SVGCircleElement, LinesMarkerDatum>(`.${this.class.marker}`)
      .data<LinesMarkerDatum>(([, indices]) =>
        this.config.getPointMarkersData(indices)
      )
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('class', (d) =>
              `${this.class.marker} ${this.config.pointMarkers.datumClass(this.config.data[d.index], d.index)}`.trim()
            )
            .attr(this.markerIndexAttr, (d) => d.index)
            .attr('cx', (d) => this.scales.x(this.config.x.values[d.index]))
            .attr('cy', (d) => this.scales.y(this.config.y.values[d.index]))
            .attr('r', this.config.pointMarkers.radius)
            .attr('fill', (d) =>
              this.scales.color(this.config.stroke.color.values[d.index])
            )
            .style('display', (d) => d.display),
        (update) =>
          update
            .attr('fill', (d) =>
              this.scales.color(this.config.stroke.color.values[d.index])
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
      .selectAll(`.${this.class.label}`)
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
            .attr('class', this.class.label)
            .attr('text-anchor', 'end')
            .attr('fill', (d) =>
              this.scales.color(this.config.stroke.color.values[d.index])
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
              this.scales.color(this.config.stroke.color.values[d.index])
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
      color: this.scales.color(this.config.stroke.color.valueAccessor(datum)),
      values: {
        strokeColor: this.config.stroke.color.valueAccessor(datum),
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
      positionX: this.scales.x(this.config.x.values[datumIndex]),
      positionY: this.scales.y(this.config.y.values[datumIndex]),
    };
  }
}
