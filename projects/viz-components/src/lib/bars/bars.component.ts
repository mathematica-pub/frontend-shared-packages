import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  format,
  InternSet,
  map,
  max,
  min,
  range,
  scaleOrdinal,
  select,
  Transition,
} from 'd3';
import { combineLatest, takeUntil } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { Ranges } from '../chart/chart.model';
import { UtilitiesService } from '../core/services/utilities.service';
import {
  XyDataMarks,
  XyDataMarksValues,
} from '../data-marks/xy-data-marks.model';
import { XY_DATA_MARKS } from '../data-marks/xy-data-marks.token';
import { Unsubscribe } from '../shared/unsubscribe.class';
import { XyChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { BarsConfig, BarsTooltipData } from './bars.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[m-charts-data-marks-bars]',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: XY_DATA_MARKS, useExisting: BarsComponent }],
})
export class BarsComponent
  extends Unsubscribe
  implements XyDataMarks, OnChanges, OnInit
{
  @ViewChild('bars', { static: true }) barsRef: ElementRef<SVGSVGElement>;
  @Input() config: BarsConfig;
  @Output() tooltipData = new EventEmitter<BarsTooltipData>();
  values: XyDataMarksValues = new XyDataMarksValues();
  hasBarsWithNegativeValues: boolean;
  bars: any;
  xScale: (d: any) => any;
  yScale: (d: any) => any;

  constructor(
    public chart: ChartComponent,
    public xySpace: XyChartSpaceComponent,
    private utilities: UtilitiesService,
    private zone: NgZone
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.utilities.objectChangedNotFirstTime(changes, 'config')) {
      this.setMethodsFromConfigAndDraw();
    }
  }

  ngOnInit(): void {
    this.subscribeToRanges();
    this.subscribeToScales();
    this.setMethodsFromConfigAndDraw();
  }

  subscribeToRanges(): void {
    this.chart.ranges$.pipe(takeUntil(this.unsubscribe)).subscribe((ranges) => {
      this.setRanges(ranges);
      if (this.xScale && this.yScale) {
        this.zone.run(() => {
          this.resizeMarks();
        });
      }
    });
  }

  setRanges(ranges: Ranges): void {
    this.config[this.config.dimensions.x].range = ranges.x;
    this.config[this.config.dimensions.y].range = ranges.y;
  }

  subscribeToScales(): void {
    const subscriptions = [this.xySpace.xScale$, this.xySpace.yScale$];
    combineLatest(subscriptions)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([xScale, yScale]): void => {
        this.xScale = xScale;
        this.yScale = yScale;
      });
  }

  setMethodsFromConfigAndDraw(): void {
    this.setValueArrays();
    this.initNonQuantitativeDomains();
    this.setValueIndicies();
    this.setHasBarsWithNegativeValues();
    this.initQuantitativeDomain();
    this.initCategoryScale();
    this.setScaledSpaceProperties();
    this.drawMarks(this.config.transitionDuration);
  }

  resizeMarks(): void {
    this.setScaledSpaceProperties();
    this.drawMarks(0);
  }

  setValueArrays(): void {
    this.values.x = map(
      this.config.data,
      this.config[this.config.dimensions.x].valueAccessor
    );
    this.values.y = map(
      this.config.data,
      this.config[this.config.dimensions.y].valueAccessor
    );
    this.values.category = map(
      this.config.data,
      this.config.category.valueAccessor
    );
  }

  initNonQuantitativeDomains(): void {
    if (this.config.ordinal.domain === undefined) {
      this.config.ordinal.domain = this.values[this.config.dimensions.ordinal];
    }
    if (this.config.category.domain === undefined) {
      this.config.category.domain = this.values.category;
    }
    this.config.ordinal.domain = new InternSet(this.config.ordinal.domain);
    this.config.category.domain = new InternSet(this.config.category.domain);
  }

  setValueIndicies(): void {
    this.values.indicies = range(
      this.values[this.config.dimensions.ordinal].length
    ).filter((i) =>
      (this.config.ordinal.domain as InternSet).has(
        this.values[this.config.dimensions.ordinal][i]
      )
    );
  }

  setHasBarsWithNegativeValues(): void {
    let dataMin;
    if (this.config.quantitative.domain === undefined) {
      dataMin = min([min(this.values[this.config.dimensions.quantitative]), 0]);
    } else {
      dataMin = this.config.quantitative.domain[0];
    }
    this.hasBarsWithNegativeValues = dataMin < 0;
  }

  initQuantitativeDomain(): void {
    if (this.config.quantitative.domain === undefined) {
      const dataMin = this.getDataMin();
      const dataMax = this.getDataMax();
      const domainMin = this.getDomainMinFromDataMin(dataMin);
      const domainMax = this.getDomainMaxFromValueExtents(dataMax, dataMin);
      if (domainMin === domainMax) {
        this.config.quantitative.domain = [domainMin, domainMin + 1];
      } else {
        this.config.quantitative.domain = [domainMin, domainMax];
      }
    }
  }

  getDataMin(): number {
    return min([min(this.values[this.config.dimensions.quantitative]), 0]);
  }

  getDataMax(): number {
    return max(this.values[this.config.dimensions.quantitative]);
  }

  getDomainMinFromDataMin(minValue: number): number {
    return minValue < 0
      ? this.chart.getPaddedDomainValue(
          minValue,
          this.config.quantitative.domainPadding
        )
      : minValue;
  }

  getDomainMaxFromValueExtents(maxValue: number, minValue: number): number {
    return maxValue > 0
      ? this.chart.getPaddedDomainValue(
          maxValue,
          this.config.quantitative.domainPadding
        )
      : this.getDomainMaxForNegativeMax(minValue);
  }

  getDomainMaxForNegativeMax(dataMin: number): number {
    const positiveValue =
      this.config.positivePaddingForAllNegativeValues * dataMin * -1;
    const roundedValue = this.chart.getQuantitativeDomainMaxRoundedUp(
      positiveValue,
      this.config.quantitative.domainPadding.sigDigits
    );
    return roundedValue;
  }

  initCategoryScale(): void {
    if (this.config.category.colorScale === undefined) {
      this.config.category.colorScale = scaleOrdinal(
        new InternSet(this.config.category.domain),
        this.config.category.colors
      );
    }
  }

  setScaledSpaceProperties(): void {
    if (this.config.dimensions.ordinal === 'x') {
      this.xySpace.updateXScale(this.getOrdinalScale());
      this.xySpace.updateYScale(this.getQuantitativeScale());
    } else {
      this.xySpace.updateXScale(this.getQuantitativeScale());
      this.xySpace.updateYScale(this.getOrdinalScale());
    }
  }

  getOrdinalScale(): any {
    return this.config.ordinal
      .scaleType(this.config.ordinal.domain, this.config.ordinal.range)
      .paddingInner(this.config.ordinal.paddingInner)
      .paddingOuter(this.config.ordinal.paddingOuter)
      .align(this.config.ordinal.align);
  }

  getQuantitativeScale(): any {
    return this.config.quantitative.scaleType(
      this.config.quantitative.domain,
      this.config.quantitative.range
    );
  }

  drawMarks(transitionDuration: number): void {
    this.drawBars(transitionDuration);
    if (this.config.labels.show) {
      this.drawBarLabels();
    }
  }

  drawBars(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.bars = select(this.barsRef.nativeElement)
      .selectAll('.bar-group')
      .data(
        this.values.indicies,
        (i: number) => this.values[this.config.dimensions.ordinal][i]
      )
      .join(
        (enter) =>
          enter
            .append('g')
            .attr('class', 'bar-group')
            .attr('transform', (i) => {
              const x = this.getBarX(i);
              const y = this.getBarY(i);
              return `translate(${x},${y})`;
            }),
        (update) =>
          update.call((update) =>
            update
              .selectAll('.bar-group')
              .transition(t as any)
              .attr('x', (i) => this.getBarX(i as number))
              .attr('y', (i) => this.getBarY(i as number))
          ),
        (exit) => exit.remove()
      );

    this.bars
      .selectAll('.bar')
      .data((i: number) => [i])
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', 'bar')
            .property(
              'key',
              (i) => this.values[this.config.dimensions.ordinal][i]
            )
            .attr('fill', (i) => this.getBarColor(i as number))
            .attr('width', (i) => this.getBarWidth(i as number))
            .attr('height', (i) => this.getBarHeight(i as number)),
        (update) =>
          update.call((update) =>
            update
              .selectAll('.bar')
              .transition(t as any)
              .attr('width', (i) => this.getBarWidth(i as number))
              .attr('height', (i) => this.getBarHeight(i as number))
          ),
        (exit) => exit.remove()
      );
  }

  drawBarLabels(): void {
    // TODO: incorporate into transition
    this.bars.selectAll('.bar-label').remove();

    this.bars
      .append('text')
      .attr('class', 'bar-label')
      .text((i) => this.getBarLabelText(i))
      .style('fill', (i) => this.getBarLabelColor(i))
      .attr('x', (i) => this.getBarLabelX(i))
      .attr('y', (i) => this.getBarLabelY(i));
  }

  getBarLabelText(i: number): string {
    const value = this.values[this.config.dimensions.quantitative][i];
    if (value === null || value === undefined) {
      return this.config.labels.noValueString;
    } else {
      return format(this.config.quantitative.valueFormat)(value);
    }
  }

  getBarLabelColor(i: number): string {
    return this.config.labels.color ?? this.getBarColor(i);
  }

  getBarColor(i: number): string {
    return this.config.category.colorScale(
      this.values[this.config.dimensions.ordinal][i]
    );
  }

  getBarX(i: number): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarXOrdinal(i);
    } else {
      return this.getBarXQuantitative(i);
    }
  }

  getBarXOrdinal(i: number): number {
    return this.xScale(this.values.x[i]);
  }

  getBarXQuantitative(i: number): number {
    if (this.hasBarsWithNegativeValues) {
      if (this.values.x[i] < 0) {
        return this.xScale(this.values.x[i]);
      } else {
        return this.xScale(0);
      }
    } else {
      return this.xScale(this.config.quantitative.domain[0]);
    }
  }

  getBarY(i: number): number {
    return this.yScale(this.values.y[i]);
  }

  getBarWidth(i: number): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarWidthOrdinal(i);
    } else {
      return this.getBarWidthQuantitative(i);
    }
  }

  getBarLabelX(i: number): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarWidthOrdinal(i) / 2;
    } else {
      let barWidth = this.getBarWidthQuantitative(i);
      if (!barWidth || isNaN(barWidth)) {
        barWidth = 0;
      }
      return barWidth + this.config.labels.offset;
    }
  }

  getBarWidthOrdinal(i: number): number {
    return (this.xScale as any).bandwidth();
  }

  getBarWidthQuantitative(i: number): number {
    const origin = this.hasBarsWithNegativeValues
      ? 0
      : this.config.quantitative.domain[0];
    return Math.abs(this.xScale(this.values.x[i]) - this.xScale(origin));
  }

  getBarHeight(i: number): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarHeightQuantitative(i);
    } else {
      return this.getBarHeightOrdinal(i);
    }
  }

  getBarLabelY(i: number): number {
    if (this.config.dimensions.ordinal === 'x') {
      let barHeight = this.getBarHeightQuantitative(i);
      if (isNaN(barHeight)) {
        barHeight = 0;
      }
      return barHeight + this.config.labels.offset;
    } else {
      return this.getBarHeightOrdinal(i) / 2;
    }
  }

  getBarHeightOrdinal(i: number): number {
    return (this.yScale as any).bandwidth();
  }

  getBarHeightQuantitative(i: number): number {
    const origin = this.hasBarsWithNegativeValues
      ? 0
      : this.config.quantitative.domain[0];
    return Math.abs(this.yScale(origin - this.values.y[i]));
  }

  onPointerEnter: (event: PointerEvent) => void;
  onPointerLeave: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
}
