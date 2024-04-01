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
  max,
  min,
  range,
  scaleOrdinal,
  select,
  Transition,
} from 'd3';
import { Selection } from 'd3-selection';
import { BehaviorSubject } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { DataDomainService } from '../core/services/data-domain.service';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { ColorUtilities } from '../shared/color-utilities.class';
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
  hasBarsWithNegativeValues: boolean;
  barGroups: BarGroupSelection;
  barsKeyFunction: (i: number) => string;
  bars: BehaviorSubject<BarSelection> = new BehaviorSubject(null);
  bars$ = this.bars.asObservable();
  barLabels: BehaviorSubject<BarLabelSelection> = new BehaviorSubject(null);
  barLabels$ = this.bars.asObservable();
  unpaddedQuantitativeDomain: [number, number];
  protected dataDomainService = inject(DataDomainService);
  protected zone = inject(NgZone);

  setPropertiesFromConfig(): void {
    this.setValueArrays();
    this.initNonQuantitativeDomains();
    this.setValueIndicies();
    this.setHasBarsWithNegativeValues();
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
        : (this.config.ordinal.domain as any[]).slice().reverse();
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

  setHasBarsWithNegativeValues(): void {
    let dataMin;
    if (this.config.quantitative.domain === undefined) {
      dataMin = min([min(this.values[this.config.dimensions.quantitative]), 0]);
    } else {
      dataMin = this.config.quantitative.domain[0];
    }
    this.hasBarsWithNegativeValues = dataMin < 0;
  }

  initUnpaddedQuantitativeDomain(): void {
    let dataMin, dataMax: number;
    if (this.config.quantitative.domain === undefined) {
      dataMin = this.getDataMin();
      dataMax = this.getDataMax();
    } else {
      dataMin = min([this.config.quantitative.domain[0], 0]);
      dataMax = max([this.config.quantitative.domain[1], 0]);
    }
    this.unpaddedQuantitativeDomain = [dataMin, dataMax];
  }

  getDataMin(): number {
    return min([min(this.values[this.config.dimensions.quantitative]), 0]);
  }

  getDataMax(): number {
    return max([max(this.values[this.config.dimensions.quantitative]), 0]);
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

  getOrdinalScale(): any {
    return this.config.ordinal
      .scaleType(
        this.config.ordinal.domain,
        this.ranges[this.config.dimensions.ordinal]
      )
      .paddingInner(this.config.ordinal.paddingInner)
      .paddingOuter(this.config.ordinal.paddingOuter)
      .align(this.config.ordinal.align);
  }

  getQuantitativeScale(): any {
    const paddedDomain = this.getPaddedQuantitativeDomain();
    return this.config.quantitative.scaleType(
      paddedDomain,
      this.ranges[this.config.dimensions.quantitative]
    );
  }

  getPaddedQuantitativeDomain(): [number, number] {
    const domain = this.dataDomainService.getQuantitativeDomain(
      this.unpaddedQuantitativeDomain,
      this.config.quantitative.domainPadding,
      this.config.quantitative.scaleType,
      this.ranges[this.config.dimensions.quantitative]
    );
    return domain;
  }

  drawMarks(): void {
    const transitionDuration = this.getTransitionDuration();
    this.drawBars(transitionDuration);
    if (this.config.labels) {
      this.drawBarLabels(transitionDuration);
    }
    this.updateBarElements();
  }

  drawBars(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
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

  drawBarLabels(transitionDuration: any): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
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
    if (!this.values.x[i]) {
      return this.scales.x(0);
    } else if (this.hasBarsWithNegativeValues) {
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
    if (this.values.y[i] < 0 || !this.values.y[i]) {
      return this.scales.y(0);
    } else {
      return this.scales.y(this.values.y[i]);
    }
  }

  getBarWidth(i: number): number {
    let width: number;
    if (this.config.dimensions.ordinal === 'x') {
      width = this.getBarWidthOrdinal();
    } else {
      width = this.getBarWidthQuantitative(i);
    }
    if (!width || isNaN(width)) {
      width = 0;
    }
    return width;
  }

  getBarWidthOrdinal(): number {
    return (this.scales.x as any).bandwidth();
  }

  getBarWidthQuantitative(i: number): number {
    const origin = this.hasBarsWithNegativeValues
      ? 0
      : this.getQuantitativeDomainFromScale()[0];
    return Math.abs(this.scales.x(this.values.x[i]) - this.scales.x(origin));
  }

  getBarHeight(i: number): number {
    let height: number;
    if (this.config.dimensions.ordinal === 'x') {
      height = this.getBarHeightQuantitative(i);
    } else {
      height = this.getBarHeightOrdinal();
    }
    if (!height || isNaN(height)) {
      height = 0;
    }
    return height;
  }

  getBarHeightOrdinal(): number {
    return (this.scales.y as any).bandwidth();
  }

  getBarHeightQuantitative(i: number): number {
    const origin = this.hasBarsWithNegativeValues
      ? 0
      : this.getQuantitativeDomainFromScale()[0];
    return Math.abs(this.scales.y(origin) - this.scales.y(this.values.y[i]));
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
      return this.getTextAlignment(i, 'start', 'end');
    }
  }

  getBarLabelDominantBaseline(
    i: number
  ): 'text-after-edge' | 'text-before-edge' | 'central' {
    if (this.config.dimensions.ordinal === 'y') {
      return 'central';
    } else {
      return this.getTextAlignment(i, 'text-after-edge', 'text-before-edge');
    }
  }

  getTextAlignment<A, B>(
    i: number,
    alignmentInPositiveDirection: A,
    alignmentInNegativeDirection: B
  ): A | B {
    const value = this.values[this.config.dimensions.quantitative][i];
    if (this.valueIsZeroOrNonnumeric(value)) {
      if (this.positionZeroOrNonnumericValueLabelInPositiveDirection()) {
        return alignmentInPositiveDirection;
      } else {
        return alignmentInNegativeDirection;
      }
    }
    const placeLabelOutsideBar = this.barLabelFitsOutsideBar(i);
    const isPositiveValue = value > 0;
    if (placeLabelOutsideBar) {
      return isPositiveValue
        ? alignmentInPositiveDirection
        : alignmentInNegativeDirection;
    } else {
      return isPositiveValue
        ? alignmentInNegativeDirection
        : alignmentInPositiveDirection;
    }
  }

  getBarLabelColor(i: number): string {
    const value = this.values[this.config.dimensions.quantitative][i];
    if (this.valueIsZeroOrNonnumeric(value) || this.barLabelFitsOutsideBar(i)) {
      return this.config.labels.darkLabelColor;
    } else {
      const barColor = this.getBarColor(i);
      return ColorUtilities.getColorWithHighestContrastRatio(
        this.config.labels.darkLabelColor,
        this.config.labels.lightLabelColor,
        barColor
      );
    }
  }

  barLabelFitsOutsideBar(i: number): boolean {
    let distance: number;
    const value = this.values[this.config.dimensions.quantitative][i];
    const isPositiveValue = value > 0;
    if (this.config.dimensions.ordinal === 'x') {
      distance = this.getBarToChartEdgeDistance(
        isPositiveValue,
        this.ranges.y,
        this.scales.y(this.values.y[i])
      );
      return distance > this.getMaxBarLabelHeight();
    } else {
      distance = this.getBarToChartEdgeDistance(
        isPositiveValue,
        this.ranges.x,
        this.scales.x(this.values.x[i])
      );
      return distance > this.getMaxBarLabelWidth(i);
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

  getMaxBarLabelWidth(i: number): number {
    const barLabelText = this.getBarLabelText(i);
    const characterPixelAllowance = 8; // TODO: future feature - create max width based on rendered d3 formatted data label
    return (
      barLabelText.length * characterPixelAllowance + this.config.labels.offset
    );
  }

  getMaxBarLabelHeight(): number {
    // TODO: future feature - create max height based on rendered d3 formatted data label
    const defaultFontSize = 16;
    const defaultLineHeight = 1.2; // default described in https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
    return defaultFontSize * defaultLineHeight + this.config.labels.offset;
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
      if (isPositiveValue) {
        return 0;
      } else {
        const barDimension = this.getBarHeightQuantitative(i);
        return !barDimension || isNaN(barDimension) ? 0 : barDimension;
      }
    } else {
      if (isPositiveValue) {
        const barDimension = this.getBarWidthQuantitative(i);
        return !barDimension || isNaN(barDimension) ? 0 : barDimension;
      } else return 0;
    }
  }

  positionZeroOrNonnumericValueLabelInPositiveDirection(): boolean {
    const quantitativeValues = this.values[this.config.dimensions.quantitative];
    const someValuesArePositive = quantitativeValues.some((x) => x > 0);
    const everyValueIsNonnumeric = quantitativeValues.every((x) =>
      isNaN(parseFloat(x))
    );
    const domainMaxIsPositive =
      this.config.quantitative.domain === undefined ||
      this.config.quantitative.domain[1] > 0;
    const everyValueIsEitherZeroOrNonnumeric = quantitativeValues.every((x) =>
      this.valueIsZeroOrNonnumeric(x)
    );
    return (
      someValuesArePositive ||
      (everyValueIsNonnumeric && domainMaxIsPositive) ||
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
