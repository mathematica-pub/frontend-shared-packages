/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectionToken,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  extent,
  group,
  InternSet,
  line,
  map,
  max,
  min,
  range,
  scaleOrdinal,
  scaleTime,
  scaleUtc,
  select,
  Transition,
} from 'd3';
import { ChartComponent } from '../chart/chart.component';
import { UtilitiesService } from '../core/services/utilities.service';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { XyDataMarks, XyDataMarksValues } from '../data-marks/xy-data-marks';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { XyContent } from '../xy-chart/xy-content';
import { LinesConfig } from './lines.config';
import { DataDomainService } from '../core/services/data-domain.service';
import { DomainPaddingConfig } from '../data-marks/data-dimension.config';

export interface Marker {
  key: string;
  index: number;
}

export class LinesTooltipData {
  datum: any;
  color: string;
  x: string;
  y: string;
  category: string;
}

export const LINES = new InjectionToken<LinesComponent>('LinesComponent');

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-lines]',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DATA_MARKS, useExisting: LinesComponent },
    { provide: LINES, useExisting: LinesComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
})
export class LinesComponent
  extends XyContent
  implements XyDataMarks, OnChanges, OnInit
{
  @ViewChild('lines', { static: true }) linesRef: ElementRef<SVGSVGElement>;
  @ViewChild('dot', { static: true }) dotRef: ElementRef<SVGSVGElement>;
  @ViewChild('markers', { static: true }) markersRef: ElementRef<SVGSVGElement>;
  @ViewChild('lineLabels', { static: true })
  lineLabelsRef: ElementRef<SVGSVGElement>;
  @Input() config: LinesConfig;
  values: XyDataMarksValues = new XyDataMarksValues();
  line: (x: any[]) => any;
  linesD3Data;
  linesKeyFunction;
  markersD3Data;
  markersKeyFunction;
  markerClass = 'vic-lines-datum-marker';
  markerIndexAttr = 'index';

  private utilities = inject(UtilitiesService);
  private zone = inject(NgZone);
  private dataDomainService = inject(DataDomainService);

  get lines(): any {
    return select(this.linesRef.nativeElement).selectAll('path');
  }

  get hoverDot(): any {
    return select(this.dotRef.nativeElement).selectAll('circle');
  }

  get markers(): any {
    return select(this.markersRef.nativeElement).selectAll('circle');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.utilities.objectOnNgChangesChangedNotFirstTime(changes, 'config')
    ) {
      this.setMethodsFromConfigAndDraw();
    }
  }

  ngOnInit(): void {
    this.subscribeToRanges();
    this.subscribeToScales();
    this.setMethodsFromConfigAndDraw();
  }

  setMethodsFromConfigAndDraw(): void {
    this.setValueArrays();
    this.initDomains();
    this.setValueIndicies();
    this.setScaledSpaceProperties();
    this.initCategoryScale();
    this.setLine();
    this.setLinesD3Data();
    this.setLinesKeyFunction();
    this.setMarkersD3Data();
    this.setMarkersKeyFunction();
    this.drawMarks(this.chart.transitionDuration);
  }

  resizeMarks(): void {
    this.setScaledSpaceProperties();
    this.setLine();
    this.drawMarks(0);
  }

  setValueArrays(): void {
    this.values.x = map(this.config.data, this.config.x.valueAccessor);
    this.values.y = map(this.config.data, this.config.y.valueAccessor);
    this.values.category = map(
      this.config.data,
      this.config.category.valueAccessor
    );
  }

  initDomains(): void {
    this.setXDomain();
    this.setYDomain();
    if (this.config.category.domain === undefined) {
      this.config.category.domain = this.values.category;
    }
  }

  setXDomain(): void {
    const domain =
      this.config.x.domain === undefined
        ? extent(this.values.x)
        : this.config.x.domain;
    const newDomain = this.getDomain(
      this.config.x.scaleType,
      this.config.x.domainPadding,
      domain
    );
    this.config.x.domain = newDomain;
  }

  setYDomain(): void {
    const domain: [any, any] =
      this.config.y.domain === undefined
        ? [min([min(this.values.y), 0]), max(this.values.y)]
        : this.config.y.domain;
    const newDomain = this.getPaddedDomain(
      this.config.y.scaleType,
      this.config.y.domainPadding,
      domain
    );
    this.config.y.domain = newDomain;
  }

  getPaddedDomain(
    scaleType: any,
    domainPadding: DomainPaddingConfig,
    domain: [any, any]
  ): [any, any] {
    if (scaleType !== scaleTime && scaleType !== scaleUtc && domainPadding) {
      const newDomain = this.dataDomainService.getQuantitativeDomainMinAndMax(
        domain[0],
        domain[1],
        domainPadding
      );
      domain = newDomain;
    }
    return domain;
  }

  setValueIndicies(): void {
    const domainInternSet = new InternSet(this.config.category.domain);
    this.values.indicies = range(this.values.x.length).filter((i) =>
      domainInternSet.has(this.values.category[i])
    );
  }

  setScaledSpaceProperties(): void {
    this.zone.run(() => {
      this.chart.updateXScale(
        this.config.x.scaleType(this.config.x.domain, this.ranges.x)
      );
      this.chart.updateYScale(
        this.config.y.scaleType(this.config.y.domain, this.ranges.y)
      );
    });
  }

  initCategoryScale(): void {
    if (this.config.category.colorScale === undefined) {
      this.config.category.colorScale = scaleOrdinal(
        new InternSet(this.config.category.domain),
        this.config.category.colors
      );
    }
    this.chart.updateCategoryScale(this.config.category.colorScale);
  }

  setLine(): void {
    if (this.config.valueIsDefined === undefined) {
      this.config.valueIsDefined = (d, i) =>
        this.canBeDrawnByPath(this.values.x[i]) &&
        this.canBeDrawnByPath(this.values.y[i]);
    }
    const isDefinedValues = map(this.config.data, this.config.valueIsDefined);

    this.line = line()
      .defined((i: any) => isDefinedValues[i] as boolean)
      .curve(this.config.curve)
      .x((i: any) => this.xScale(this.values.x[i]))
      .y((i: any) => this.yScale(this.values.y[i]));
  }

  canBeDrawnByPath(x: any): boolean {
    return (
      (typeof x === 'number' || this.utilities.isDate(x)) &&
      x !== null &&
      x !== undefined
    );
  }

  setLinesD3Data(): void {
    const definedIndices = this.values.indicies.filter(
      (i) =>
        this.canBeDrawnByPath(this.values.x[i]) &&
        this.canBeDrawnByPath(this.values.y[i])
    );
    this.linesD3Data = group(definedIndices, (i) => this.values.category[i]);
  }

  setLinesKeyFunction(): void {
    this.linesKeyFunction = (d): string => d[0];
  }

  setMarkersD3Data(): void {
    this.markersD3Data = this.values.indicies
      .map((i) => {
        return { key: this.getMarkerKey(i), index: i };
      })
      .filter(
        (marker: Marker) =>
          this.canBeDrawnByPath(this.values.x[marker.index]) &&
          this.canBeDrawnByPath(this.values.y[marker.index])
      );
  }

  getMarkerKey(i: number): string {
    return `${this.values.category[i]}-${this.values.x[i]}`;
  }

  setMarkersKeyFunction(): void {
    this.markersKeyFunction = (d) => (d as Marker).key;
  }

  drawMarks(transitionDuration: number): void {
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

  drawLines(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.lines.data(this.linesD3Data, this.linesKeyFunction).join(
      (enter) =>
        enter
          .append('path')
          .attr('key', ([category]) => category)
          .attr('class', 'vic-line')
          .attr('stroke', ([category]) => this.categoryScale(category))
          .attr('d', ([, lineData]) => this.line(lineData)),
      (update) =>
        update
          .attr('stroke', ([category]) => this.categoryScale(category))
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

    this.markers.data(this.markersD3Data, this.markersKeyFunction).join(
      (enter) =>
        enter
          .append('circle')
          .attr('class', this.markerClass)
          .attr('key', (d) => d.key)
          .attr(this.markerIndexAttr, (d) => d.index)
          .style('mix-blend-mode', this.config.mixBlendMode)
          .attr('cx', (d) => this.xScale(this.values.x[d.index]))
          .attr('cy', (d) => this.yScale(this.values.y[d.index]))
          .attr('r', this.config.pointMarkers.radius)
          .attr('fill', (d) =>
            this.categoryScale(this.values.category[d.index])
          ),
      (update) =>
        update
          .attr('fill', (d) =>
            this.categoryScale(this.values.category[d.index])
          )
          .call((update) =>
            update
              .transition(t as any)
              .attr('cx', (d) => this.xScale(this.values.x[d.index]))
              .attr('cy', (d) => this.yScale(this.values.y[d.index]))
          ),
      (exit) => exit.remove()
    );
  }

  drawLineLabels(): void {
    const lastPoints = [];
    this.linesD3Data.forEach((values, key) => {
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
      .attr('fill', (d) => this.categoryScale(this.values.category[d.index]))
      .attr('x', (d) => `${this.xScale(this.values.x[d.index]) - 4}px`)
      .attr('y', (d) => `${this.yScale(this.values.y[d.index]) - 12}px`)
      .text((d) => this.config.lineLabelsFormat(d.category));
  }
}
