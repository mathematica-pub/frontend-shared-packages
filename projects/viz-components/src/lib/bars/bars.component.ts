/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  NgZone,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  InternSet,
  map,
  min,
  range,
  scaleOrdinal,
  select,
  Transition,
} from 'd3';
import { Selection } from 'd3-selection';
import { BehaviorSubject } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { QuantitativeDomainUtilities } from '../core/utilities/quantitative-domain';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { VicColorUtilities } from '../shared/color-utilities.class';
import { PatternUtilities } from '../shared/pattern-utilities.class';
import { formatValue } from '../value-format/value-format';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { XyDataMarksBase } from '../xy-data-marks/xy-data-marks-base';
import { VicBarsConfig, VicBarsTooltipData } from './bars.config';

// Ideally we would be able to use generic T with the component, but Angular doesn't yet support this, so we use unknown instead
// https://github.com/angular/angular/issues/46815, https://github.com/angular/angular/pull/47461
export const BARS = new InjectionToken<BarsComponent<unknown>>('BarsComponent');

export type BarGroupSelection = Selection<
  SVGGElement,
  number,
  SVGSVGElement,
  unknown
>;
export type BarSelection = Selection<
  SVGRectElement,
  number,
  SVGGElement,
  number
>;
export type BarLabelSelection = Selection<
  SVGTextElement,
  number,
  SVGGElement,
  number
>;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-bars]',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DATA_MARKS, useExisting: BarsComponent },
    { provide: BARS, useExisting: BarsComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
})
export class BarsComponent<Datum> extends XyDataMarksBase<
  Datum,
  VicBarsConfig<Datum>
> {
  @ViewChild('bars', { static: true }) barsRef: ElementRef<SVGSVGElement>;
  @Output() tooltipData = new EventEmitter<VicBarsTooltipData>();
  chartHasNegativeMinValue: boolean;
  barGroups: BarGroupSelection;
  barsKeyFunction: (i: number) => string;
  bars: BehaviorSubject<BarSelection> = new BehaviorSubject(null);
  bars$ = this.bars.asObservable();
  barLabels: BehaviorSubject<BarLabelSelection> = new BehaviorSubject(null);
  barLabels$ = this.bars.asObservable();
  unpaddedDomain: {
    quantitative: [number, number];
  } = { quantitative: undefined };
  protected zone = inject(NgZone);

  setPropertiesFromConfig(): void {
    this.setValueArrays();
    this.initNonQuantitativeDomains();
    this.setValueIndicies();
    this.setChartHasNegativeMinValue();
    this.initUnpaddedQuantitativeDomain();
    this.initCategoryScale();
    this.setBarsKeyFunction();
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
    const ordinalDomain =
      this.config.dimensions.ordinal === 'x'
        ? this.config.ordinal.domain
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this.config.ordinal.domain as any[]).slice().reverse();
    this.config.ordinal.domain = new InternSet(ordinalDomain);
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

  setChartHasNegativeMinValue(): void {
    let dataMin;
    if (this.config.quantitative.domain === undefined) {
      dataMin = min([min(this.values[this.config.dimensions.quantitative]), 0]);
    } else {
      dataMin = this.config.quantitative.domain[0];
    }
    this.chartHasNegativeMinValue = dataMin < 0;
  }

  initUnpaddedQuantitativeDomain(): void {
    this.unpaddedDomain.quantitative =
      QuantitativeDomainUtilities.getUnpaddedDomain(
        this.config.quantitative.domain,
        this.values[this.config.dimensions.quantitative],
        this.config.quantitative.domainIncludesZero
      );
    if (
      !this.config.quantitative.domainIncludesZero &&
      this.unpaddedDomain.quantitative[0] <= 0 &&
      this.unpaddedDomain.quantitative[1] >= 0
    ) {
      this.config.quantitative.domainIncludesZero = true;
    }
  }

  initCategoryScale(): void {
    if (this.config.category.colorScale === undefined) {
      this.config.category.colorScale = scaleOrdinal(
        new InternSet(this.config.category.domain),
        this.config.category.colors
      );
    }
  }

  setBarsKeyFunction(): void {
    this.barsKeyFunction = (i: number): string =>
      `${this.values[this.config.dimensions.ordinal][i]}`;
  }

  /**
   * setPropertiesFromRanges method
   *
   * This method creates and sets scales on ChartComponent. Any methods that require ranges
   * to create the scales should be called from this method. Methods called from here should not
   * require scales.
   *
   * This method is called on init, after config-based properties are set, and also on
   * resize/when ranges change.
   */
  setPropertiesFromRanges(useTransition: boolean): void {
    const x =
      this.config.dimensions.ordinal === 'x'
        ? this.getOrdinalScale()
        : this.getQuantitativeScale();
    const y =
      this.config.dimensions.ordinal === 'x'
        ? this.getQuantitativeScale()
        : this.getOrdinalScale();
    const category = this.config.category.colorScale;
    this.zone.run(() => {
      this.chart.updateScales({ x, y, category, useTransition });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOrdinalScale(): any {
    return this.config.ordinal
      .scaleFn()
      .domain(this.config.ordinal.domain)
      .range(this.ranges[this.config.dimensions.ordinal])
      .paddingInner(this.config.ordinal.paddingInner)
      .paddingOuter(this.config.ordinal.paddingOuter)
      .align(this.config.ordinal.align);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getQuantitativeScale(): any {
    const domain = this.config.quantitative.domainPadding
      ? this.getPaddedQuantitativeDomain()
      : this.unpaddedDomain.quantitative;
    return this.config.quantitative
      .scaleFn()
      .domain(domain)
      .range(this.ranges[this.config.dimensions.quantitative]);
  }

  getPaddedQuantitativeDomain(): [number, number] {
    const domain = QuantitativeDomainUtilities.getPaddedDomain(
      this.unpaddedDomain.quantitative,
      this.config.quantitative.domainPadding,
      this.config.quantitative.scaleFn,
      this.ranges[this.config.dimensions.quantitative]
    );
    return domain;
  }

  drawMarks(): void {
    const transitionDuration = this.getTransitionDuration();
    this.drawBars(transitionDuration);
    // Do not check if config.labels.display is defined here because labels
    // may be drawn but not immediately displayed (e.g., revealed on hover).
    if (this.config.labels) {
      this.drawBarLabels(transitionDuration);
    }
    this.updateBarElements();
  }

  drawBars(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.barGroups = select(this.barsRef.nativeElement)
      .selectAll<SVGGElement, number>('.vic-bar-group')
      .data<number>(this.values.indicies, this.barsKeyFunction)
      .join(
        (enter) =>
          enter
            .append('g')
            .attr('class', 'vic-bar-group')
            .attr('transform', (i) => this.getBarGroupTransform(i)),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr('transform', (i) => this.getBarGroupTransform(i)),
        (exit) => exit.remove()
      );

    this.barGroups
      .selectAll<SVGRectElement, number>('.vic-bar')
      .data<number>((i) => [i])
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', 'vic-bar')
            .property('key', (i) => this.getBarKey(i))
            .attr('width', (i) => this.getBarWidth(i))
            .attr('height', (i) => this.getBarHeight(i))
            .attr('fill', (i) => this.getBarFill(i)),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr('width', (i) => this.getBarWidth(i))
            .attr('height', (i) => this.getBarHeight(i))
            .attr('fill', (i) => this.getBarFill(i)),
        (exit) => exit.remove()
      );
  }

  getBarKey(i: number): string {
    return this.values[this.config.dimensions.ordinal][i];
  }

  getBarGroupTransform(i: number): string {
    const x = this.getBarX(i);
    const y = this.getBarY(i);
    return `translate(${x},${y})`;
  }

  getBarFill(i: number): string {
    return this.config.patternPredicates
      ? this.getBarPattern(i)
      : this.getBarColor(i);
  }

  drawBarLabels(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.barGroups
      .selectAll<SVGTextElement, number>('text')
      .data((i: number) => [i])
      .join(
        (enter) =>
          enter
            .append<SVGTextElement>('text')
            .attr('class', 'vic-bar-label')
            .style('display', this.config.labels.display ? null : 'none')
            .text((i) => this.getBarLabelText(i))
            .style('fill', (i) => this.getBarLabelColor(i))
            .attr('x', (i) => this.getBarLabelX(i))
            .attr('y', (i) => this.getBarLabelY(i))
            .attr('text-anchor', (i) => this.getBarLabelTextAnchor(i))
            .attr('dominant-baseline', (i) =>
              this.getBarLabelDominantBaseline(i)
            ),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .text((i) => this.getBarLabelText(i))
            .style('fill', (i) => this.getBarLabelColor(i))
            .attr('x', (i) => this.getBarLabelX(i))
            .attr('y', (i) => this.getBarLabelY(i))
            .attr('text-anchor', (i) => this.getBarLabelTextAnchor(i))
            .attr('dominant-baseline', (i) =>
              this.getBarLabelDominantBaseline(i)
            ),
        (exit) => exit.remove()
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
    return this.scales.x(this.values.x[i]);
  }

  getBarXQuantitative(i: number): number {
    if (isNaN(parseFloat(this.values.x[i]))) {
      const origin = this.getBarQuantitativeOrigin();
      return this.scales.x(origin);
    } else if (this.chartHasNegativeMinValue) {
      if (this.values.x[i] < 0) {
        return this.scales.x(this.values.x[i]);
      } else {
        return this.scales.x(0);
      }
    } else {
      return this.scales.x(this.getQuantitativeDomainFromScale()[0]);
    }
  }

  getQuantitativeDomainFromScale(): number[] {
    return this.scales[this.config.dimensions.quantitative].domain();
  }

  getBarY(i: number): number {
    if (this.config.dimensions.ordinal === 'y') {
      return this.getBarYOrdinal(i);
    } else {
      return this.getBarYQuantitative(i);
    }
  }

  getBarYOrdinal(i: number): number {
    return this.scales.y(this.values.y[i]);
  }

  getBarYQuantitative(i: number): number {
    if (isNaN(parseFloat(this.values.y[i]))) {
      const origin = this.getBarQuantitativeOrigin();
      return this.scales.y(origin);
    } else if (this.values.y[i] < 0) {
      if (this.config.quantitative.domainIncludesZero) {
        return this.scales.y(0);
      } else {
        return this.scales.y(this.getQuantitativeDomainFromScale()[1]);
      }
    } else {
      return this.scales.y(this.values.y[i]);
    }
  }

  getBarWidth(i: number): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarWidthOrdinal();
    } else {
      return this.getBarWidthQuantitative(i);
    }
  }

  getBarWidthOrdinal(): number {
    return (this.scales.x as any).bandwidth();
  }

  getBarWidthQuantitative(i: number): number {
    const origin = this.getBarQuantitativeOrigin();
    const width = Math.abs(
      this.scales.x(this.values.x[i]) - this.scales.x(origin)
    );
    return !width || isNaN(width) ? 0 : width;
  }

  getBarHeight(i: number): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarHeightQuantitative(i);
    } else {
      return this.getBarHeightOrdinal();
    }
  }

  getBarHeightOrdinal(): number {
    return (this.scales.y as any).bandwidth();
  }

  getBarHeightQuantitative(i: number): number {
    const origin = this.getBarQuantitativeOrigin();
    const height = Math.abs(
      this.scales.y(origin) - this.scales.y(this.values.y[i])
    );
    return !height || isNaN(height) ? 0 : height;
  }

  getBarQuantitativeOrigin(): number {
    if (this.config.quantitative.domainIncludesZero) {
      return 0;
    } else {
      return this.chartHasNegativeMinValue
        ? this.getQuantitativeDomainFromScale()[1]
        : this.getQuantitativeDomainFromScale()[0];
    }
  }

  getBarPattern(i: number): string {
    const color = this.getBarColor(i);
    const predicates = this.config.patternPredicates;
    return PatternUtilities.getPatternFill(
      this.config.data[i],
      color,
      predicates
    );
  }

  getBarColor(i: number): string {
    return this.scales.category(this.values[this.config.dimensions.ordinal][i]);
  }

  getBarLabelText(i: number): string {
    const value = this.values[this.config.dimensions.quantitative][i];
    const datum = this.config.data[i];
    if (isNaN(parseFloat(value))) {
      return this.config.labels.noValueFunction(datum);
    } else if (typeof this.config.quantitative.valueFormat === 'function') {
      return formatValue(datum, this.config.quantitative.valueFormat);
    } else {
      return formatValue(value, this.config.quantitative.valueFormat);
    }
  }

  getBarLabelTextAnchor(i: number): 'start' | 'middle' | 'end' {
    if (this.config.dimensions.ordinal === 'x') {
      return 'middle';
    } else {
      return this.alignTextInPositiveDirection(i) ? 'start' : 'end';
    }
  }

  getBarLabelDominantBaseline(
    i: number
  ): 'text-after-edge' | 'text-before-edge' | 'central' {
    if (this.config.dimensions.ordinal === 'y') {
      return 'central';
    } else {
      return this.alignTextInPositiveDirection(i)
        ? 'text-after-edge'
        : 'text-before-edge';
    }
  }

  alignTextInPositiveDirection(i: number): boolean {
    const value = this.values[this.config.dimensions.quantitative][i];
    if (this.valueIsZeroOrNonnumeric(value)) {
      return this.positionZeroOrNonnumericValueLabelInPositiveDirection();
    }
    const placeLabelOutsideBar = this.barLabelFitsOutsideBar(i);
    const isPositiveValue = value > 0;
    return placeLabelOutsideBar ? isPositiveValue : !isPositiveValue;
  }

  getBarLabelColor(i: number): string {
    const value = this.values[this.config.dimensions.quantitative][i];
    if (this.valueIsZeroOrNonnumeric(value) || this.barLabelFitsOutsideBar(i)) {
      return this.config.labels.defaultLabelColor;
    } else {
      const barColor = this.getBarColor(i);
      return VicColorUtilities.getHigherContrastColorForBackground(
        barColor,
        this.config.labels.defaultLabelColor,
        this.config.labels.withinBarAlternativeLabelColor
      );
    }
  }

  barLabelFitsOutsideBar(i: number): boolean {
    let distance: number;
    const value = this.values[this.config.dimensions.quantitative][i];
    const isPositiveValue = value > 0;
    // This approach assumes that the bar labels do not wrap.
    if (this.config.dimensions.ordinal === 'x') {
      distance = this.getBarToChartEdgeDistance(
        isPositiveValue,
        this.ranges.y,
        this.scales.y(this.values.y[i])
      );
      return distance > this.getBarLabelHeight(i);
    } else {
      distance = this.getBarToChartEdgeDistance(
        isPositiveValue,
        this.ranges.x,
        this.scales.x(this.values.x[i])
      );
      return distance > this.getBarLabelWidth(i);
    }
  }

  getBarToChartEdgeDistance(
    isPositiveValue: boolean,
    range: [number, number],
    barValue: number
  ): number {
    return isPositiveValue
      ? Math.abs(range[1] - barValue)
      : Math.abs(barValue - range[0]);
  }

  getBarLabelWidth(i: number): number {
    const width = this.getLabelDomRect(i).width;
    return width + this.config.labels.offset;
  }

  getBarLabelHeight(i: number): number {
    const height = this.getLabelDomRect(i).height;
    return height + this.config.labels.offset;
  }

  getLabelDomRect(i: number): DOMRect {
    const selection = select(this.barsRef.nativeElement)
      .selectAll('.vic-bar-label')
      .filter((_, j: number) => j === i);
    return (selection.node() as Element).getBoundingClientRect();
  }

  getBarLabelX(i: number): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarWidthOrdinal() / 2;
    } else {
      return this.getBarLabelQuantitativeAxisPosition(i);
    }
  }

  getBarLabelY(i: number): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarLabelQuantitativeAxisPosition(i);
    } else {
      return this.getBarHeightOrdinal() / 2;
    }
  }

  getBarLabelQuantitativeAxisPosition(i: number): number {
    const value = this.values[this.config.dimensions.quantitative][i];
    if (this.valueIsZeroOrNonnumeric(value)) {
      return this.getBarLabelPositionForZeroOrNonnumericValue();
    } else {
      return this.getBarLabelPositionForNumericValue(i);
    }
  }

  getBarLabelPositionForZeroOrNonnumericValue(): number {
    const positionInPositiveDirection =
      this.positionZeroOrNonnumericValueLabelInPositiveDirection();
    return (positionInPositiveDirection &&
      this.config.dimensions.ordinal === 'y') ||
      (!positionInPositiveDirection && this.config.dimensions.ordinal === 'x')
      ? this.config.labels.offset
      : -this.config.labels.offset;
  }

  getBarLabelPositionForNumericValue(i: number): number {
    const value = this.values[this.config.dimensions.quantitative][i];
    const isPositiveValue = value > 0;
    const origin = this.getBarLabelOrigin(i, isPositiveValue);
    const placeLabelOutsideBar = this.barLabelFitsOutsideBar(i);
    if (
      (this.config.dimensions.ordinal === 'x' && placeLabelOutsideBar) ||
      (this.config.dimensions.ordinal === 'y' && !placeLabelOutsideBar)
    ) {
      return isPositiveValue
        ? origin - this.config.labels.offset
        : origin + this.config.labels.offset;
    } else {
      return isPositiveValue
        ? origin + this.config.labels.offset
        : origin - this.config.labels.offset;
    }
  }

  getBarLabelOrigin(i: number, isPositiveValue: boolean): number {
    if (this.config.dimensions.ordinal === 'x') {
      return isPositiveValue ? 0 : this.getBarHeightQuantitative(i);
    } else {
      return isPositiveValue ? this.getBarWidthQuantitative(i) : 0;
    }
  }

  positionZeroOrNonnumericValueLabelInPositiveDirection(): boolean {
    const quantitativeValues = this.values[this.config.dimensions.quantitative];
    const someValuesArePositive = quantitativeValues.some((x) => x > 0);
    const domainMaxIsPositive = this.getQuantitativeDomainFromScale()[1] > 0;
    const everyValueIsEitherZeroOrNonnumeric = quantitativeValues.every((x) =>
      this.valueIsZeroOrNonnumeric(x)
    );
    return (
      someValuesArePositive ||
      (everyValueIsEitherZeroOrNonnumeric && domainMaxIsPositive)
    );
  }

  valueIsZeroOrNonnumeric(value: any): boolean {
    return isNaN(parseFloat(value)) || value === 0;
  }

  updateBarElements(): void {
    const bars = select(this.barsRef.nativeElement).selectAll<
      SVGRectElement,
      number
    >('rect');
    const barLabels = select(this.barsRef.nativeElement).selectAll<
      SVGTextElement,
      number
    >('text');
    this.bars.next(bars);
    this.barLabels.next(barLabels);
  }
}
