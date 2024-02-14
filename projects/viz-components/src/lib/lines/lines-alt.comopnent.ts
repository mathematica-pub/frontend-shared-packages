/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { line, map, scaleTime, scaleUtc, select, Transition } from 'd3';
import { isEqual } from 'lodash-es';
import { filter } from 'rxjs/operators';
import { ChartComponent, Ranges } from '../chart/chart.component';
import { DataDomainService } from '../core/services/data-domain.service';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import {
  XyChartComponent,
  XyChartScales,
  XyContentScale,
} from '../xy-chart/xy-chart.component';
import { VicLinesConfigBuilder } from './lines-alt.config';
import { LinesComponent } from './lines.component';

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

export const LINES = new InjectionToken<LinesComponent<unknown>>(
  'LinesComponent'
);

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-lines-alt]',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DATA_MARKS, useExisting: LinesAltComponent },
    { provide: LINES, useExisting: LinesAltComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
})
export class LinesAltComponent<T> implements OnChanges, OnInit {
  @Input() config: VicLinesConfigBuilder<T>;
  @ViewChild('lines', { static: true }) linesRef: ElementRef<SVGSVGElement>;
  @ViewChild('dot', { static: true }) dotRef: ElementRef<SVGSVGElement>;
  @ViewChild('markers', { static: true }) markersRef: ElementRef<SVGSVGElement>;
  @ViewChild('lineLabels', { static: true })
  lineLabelsRef: ElementRef<SVGSVGElement>;
  line: (x: any[]) => any;
  ranges: Ranges;
  scales: XyChartScales;
  requiredScales: (keyof typeof XyContentScale)[];
  public chart = inject(XyChartComponent);
  destroyRef = inject(DestroyRef);
  linesKeyFunction = (d): string => d[0];
  markersKeyFunction = (d) => (d as Marker).key;
  markerClass = 'vic-lines-datum-marker';
  markerIndexAttr = 'index';

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

  // NOTE: from ngOnChanges to getTransitionDuration would all go back on extended base components if we changes all DM components to work this way
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['config'] &&
      !changes['config'].isFirstChange() &&
      !isEqual(changes['config'].currentValue, changes['config'].previousValue)
    ) {
      this.setPropertiesFromRanges(true);
    }
  }

  ngOnInit(): void {
    this.setRequiredChartScales();
    this.subscribeToRanges();
    this.subscribeToScales();
    this.setPropertiesFromRanges(true);
  }

  setRequiredChartScales(): void {
    this.requiredScales = [
      XyContentScale.x,
      XyContentScale.y,
      XyContentScale.category,
    ];
  }

  subscribeToRanges(): void {
    this.chart.ranges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ranges) => {
        this.ranges = ranges;
        if (
          this.scales &&
          this.requiredScales.every((scale) => this.scales[scale])
        ) {
          this.resizeMarks();
        }
      });
  }

  subscribeToScales(): void {
    this.chart.scales$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((scales) => !!scales)
      )
      .subscribe((scales): void => {
        // set scales as local property so that event directives can access it
        // also to remain parity with non-DM components like axes that need to subscribe
        // because chart component isn't expecting them
        this.scales = scales;
        this.drawMarks();
      });
  }

  resizeMarks(): void {
    this.setPropertiesFromRanges(false);
  }

  getTransitionDuration(): number {
    return this.scales.useTransition ? this.chart.transitionDuration : 0;
  }

  /**
   * setPropertiesFromRanges method
   *
   * This method sets creates and sets scales on ChartComponent. Any methods that require ranges
   * to create the scales should be called from this method. Methods called from here should not
   * require scales.
   *
   * This method is called on init, after config-based properties are set, and also on
   * resize/when ranges change.
   */
  setPropertiesFromRanges(useTransition: boolean): void {
    const paddedXDomain = this.getPaddedDomain('x');
    const paddedYDomain = this.getPaddedDomain('y');
    const x = this.config.x.scaleType(paddedXDomain, this.ranges.x);
    const y = this.config.y.scaleType(paddedYDomain, this.ranges.y);
    const category = this.config.category.colorScale;
    this.zone.run(() => {
      this.chart.updateScales({ x, y, category, useTransition });
    });
  }

  getPaddedDomain(dimension: 'x' | 'y'): [any, any] {
    if (
      this.config[dimension].scaleType !== scaleTime &&
      this.config[dimension].scaleType !== scaleUtc
    ) {
      const paddedDomain = this.dataDomainService.getQuantitativeDomain(
        this.config.unpaddedDomain[dimension],
        this.config[dimension].domainPadding,
        this.config[dimension].scaleType,
        this.ranges[dimension]
      );
      return paddedDomain;
    } else {
      return this.config.unpaddedDomain[dimension];
    }
  }

  /**
   * drawMarks method
   *
   * All methods that require scales should be called from drawMarks. Methods
   * called from here should not scale.domain() or scale.range() to obtain those values
   * rather than this.config.dimension.domain or this.ranges.dimension.
   *
   * This method is called when scales emit from ChartComponent.
   */
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
        this.config.canBeDrawnByPath(this.config.values.x[i]) &&
        this.config.canBeDrawnByPath(this.config.values.y[i]);
    }
    const isDefinedValues = map(this.config._data, this.config.valueIsDefined);

    this.line = line()
      .defined((i: any) => isDefinedValues[i] as boolean)
      .curve(this.config.curve)
      .x((i: any) => this.scales.x(this.config.values.x[i]))
      .y((i: any) => this.scales.y(this.config.values.y[i]));
  }

  drawLines(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.lines.data(this.config.linesD3Data, this.linesKeyFunction).join(
      (enter) =>
        enter
          .append('path')
          .attr('key', ([category]) => category)
          .attr('class', 'vic-line')
          .attr('stroke', ([category]) => this.scales.category(category))
          .attr('d', ([, lineData]) => this.line(lineData)),
      (update) =>
        update
          .attr('stroke', ([category]) => this.scales.category(category))
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

    this.markers.data(this.config.markersD3Data, this.markersKeyFunction).join(
      (enter) =>
        enter
          .append('circle')
          .attr('class', this.markerClass)
          .attr('key', (d) => d.key)
          .attr(this.markerIndexAttr, (d) => d.index)
          .style('mix-blend-mode', this.config.mixBlendMode)
          .attr('cx', (d) => this.scales.x(this.config.values.x[d.index]))
          .attr('cy', (d) => this.scales.y(this.config.values.y[d.index]))
          .attr('r', this.config.pointMarkers.radius)
          .attr('fill', (d) =>
            this.scales.category(this.config.values.category[d.index])
          ),
      (update) =>
        update
          .attr('fill', (d) =>
            this.scales.category(this.config.values.category[d.index])
          )
          .call((update) =>
            update
              .transition(t as any)
              .attr('cx', (d) => this.scales.x(this.config.values.x[d.index]))
              .attr('cy', (d) => this.scales.y(this.config.values.y[d.index]))
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
        this.scales.category(this.config.values.category[d.index])
      )
      .attr('x', (d) => `${this.scales.x(this.config.values.x[d.index]) - 4}px`)
      .attr(
        'y',
        (d) => `${this.scales.y(this.config.values.y[d.index]) - 12}px`
      )
      .text((d) => this.config.lineLabelsFormat(d.category));
  }
}
