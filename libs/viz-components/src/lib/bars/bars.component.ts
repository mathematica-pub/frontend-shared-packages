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
import { select, selectAll, Transition } from 'd3';
import { Selection } from 'd3-selection';
import { BehaviorSubject } from 'rxjs';
import { ChartComponent } from '../charts/chart/chart.component';
import {
  XyChartComponent,
  XyChartScales,
} from '../charts/xy-chart/xy-chart.component';
import { GenericScale } from '../core';
import { DataValue } from '../core/types/values';
import { ColorUtilities } from '../core/utilities/colors';
import { FillUtilities } from '../core/utilities/fill-utilities';
import { isNumber } from '../core/utilities/type-guards';
import { ValueUtilities } from '../core/utilities/values';
import { VIC_PRIMARY_MARKS } from '../marks/primary-marks/primary-marks';
import { VicXyPrimaryMarks } from '../marks/xy-marks/xy-primary-marks/xy-primary-marks';
import { BarsConfig } from './config/bars-config';

// Ideally we would be able to use generic T with the component, but Angular doesn't yet support this, so we use "unknown"
// https://github.com/angular/angular/issues/46815, https://github.com/angular/angular/pull/47461
export const BARS = new InjectionToken<BarsComponent<unknown, DataValue>>(
  'BarsComponent'
);

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

export type BarDatum<T> = {
  index: number;
  quantitative: number;
  ordinal: T;
  color: string;
};

export interface BarsTooltipDatum<Datum, TOrdinalValue extends DataValue> {
  datum: Datum;
  color: string;
  ordinal: TOrdinalValue;
  quantitative: string;
  category: string;
  elRef: ElementRef;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-primary-marks-bars]',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_PRIMARY_MARKS, useExisting: BarsComponent },
    { provide: BARS, useExisting: BarsComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
})
export class BarsComponent<
  Datum,
  TOrdinalValue extends DataValue,
> extends VicXyPrimaryMarks<Datum, BarsConfig<Datum, TOrdinalValue>> {
  @ViewChild('bars', { static: true }) barsRef: ElementRef<SVGSVGElement>;
  barGroups: BarGroupSelection;
  bars: BehaviorSubject<BarSelection> = new BehaviorSubject(null);
  bars$ = this.bars.asObservable();
  barLabels: BehaviorSubject<BarLabelSelection> = new BehaviorSubject(null);
  barLabels$ = this.bars.asObservable();
  protected zone = inject(NgZone);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override scales: { color: GenericScale<any, any> } & XyChartScales = {
    x: undefined,
    y: undefined,
    color: undefined,
    useTransition: undefined,
  };

  setChartScalesFromRanges(useTransition: boolean): void {
    const x = this.config[this.config.dimensions.x].getScaleFromRange(
      this.ranges.x
    );
    const y = this.config[this.config.dimensions.y].getScaleFromRange(
      this.ranges.y
    );
    this.scales.color = this.config.color.getScale();
    this.chart.updateScales({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      x: x as unknown as GenericScale<any, any>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y: y as unknown as GenericScale<any, any>,
      useTransition,
    });
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.barGroups = select(this.barsRef.nativeElement)
      .selectAll<SVGGElement, number>('.vic-bar-group')
      .data<number>(this.config.valueIndices, this.config.barsKeyFunction)
      .join(
        (enter) =>
          enter
            .append('g')
            .attr('class', 'vic-bar-group')
            .attr('transform', (i) =>
              this.getBarGroupTransform(this.getBarDatumFromIndex(i))
            ),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr('transform', (i) =>
              this.getBarGroupTransform(this.getBarDatumFromIndex(i))
            ),
        (exit) => exit.remove()
      );

    this.barGroups
      .selectAll<SVGRectElement, BarDatum<TOrdinalValue>>('.vic-bar')
      .data<BarDatum<TOrdinalValue>>((i) => [this.getBarDatumFromIndex(i)])
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', 'vic-bar')
            .property('key', (d) => d.ordinal)
            .attr('width', (d) => this.getBarWidth(d))
            .attr('height', (d) => this.getBarHeight(d))
            .attr('fill', (d) => this.getBarFill(d)),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr('width', (d) => this.getBarWidth(d))
            .attr('height', (d) => this.getBarHeight(d))
            .attr('fill', (d) => this.getBarFill(d)),
        (exit) => exit.remove()
      );
  }

  getBarDatumFromIndex(i: number): BarDatum<TOrdinalValue> {
    return {
      index: i,
      quantitative: this.config.quantitative.values[i],
      ordinal: this.config.ordinal.values[i],
      color: this.config.color.values[i],
    };
  }

  getBarGroupTransform(datum: BarDatum<TOrdinalValue>): string {
    const x = this.getBarX(datum);
    const y = this.getBarY(datum);
    return `translate(${x},${y})`;
  }

  getBarFill(datum: BarDatum<TOrdinalValue>): string {
    return this.config.color.fillDefs
      ? this.getBarPattern(datum)
      : this.getBarColor(datum);
  }

  drawBarLabels(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.barGroups
      .selectAll<SVGTextElement, BarDatum<TOrdinalValue>>('text')
      .data<BarDatum<TOrdinalValue>>((i: number) => [
        {
          index: i,
          quantitative: this.config.quantitative.values[i],
          ordinal: this.config.ordinal.values[i],
          color: this.config.color.values[i],
        },
      ])
      .join(
        (enter) =>
          enter
            .append<SVGTextElement>('text')
            .attr('class', 'vic-bar-label')
            .style('display', this.config.labels.display ? null : 'none')
            .text((d) => this.getBarLabelText(d))
            .style('fill', (d) => this.getBarLabelColor(d))
            .attr('x', (d) => this.getBarLabelX(d))
            .attr('y', (d) => this.getBarLabelY(d))
            .attr('text-anchor', (d) => this.getBarLabelTextAnchor(d))
            .attr('dominant-baseline', (d) =>
              this.getBarLabelDominantBaseline(d)
            ),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .text((d) => this.getBarLabelText(d))
            .style('fill', (d) => this.getBarLabelColor(d))
            .attr('x', (d) => this.getBarLabelX(d))
            .attr('y', (d) => this.getBarLabelY(d))
            .attr('text-anchor', (d) => this.getBarLabelTextAnchor(d))
            .attr('dominant-baseline', (d) =>
              this.getBarLabelDominantBaseline(d)
            ),
        (exit) => exit.remove()
      );
  }

  getBarX(d: BarDatum<TOrdinalValue>): number {
    if (this.config.dimensions.x === 'ordinal') {
      return this.getBarXOrdinal(d);
    } else {
      return this.getBarXQuantitative(d);
    }
  }

  getBarXOrdinal(d: BarDatum<TOrdinalValue>): number {
    return this.scales.x(d.ordinal);
  }

  getBarXQuantitative(d: BarDatum<TOrdinalValue>): number {
    if (this.isZeroOrNonNumeric(d.quantitative)) {
      const origin = this.getBarQuantitativeOrigin();
      return this.scales.x(origin);
    } else if (this.config.hasNegativeValues) {
      if (d.quantitative < 0) {
        return this.scales.x(d.quantitative);
      } else {
        return this.scales.x(0);
      }
    } else {
      return this.scales.x(this.getQuantitativeDomainFromScale()[0]);
    }
  }

  getBarY(d: BarDatum<TOrdinalValue>): number {
    if (this.config.dimensions.y === 'ordinal') {
      return this.getBarYOrdinal(d);
    } else {
      return this.getBarYQuantitative(d);
    }
  }

  getBarYOrdinal(d: BarDatum<TOrdinalValue>): number {
    return this.scales.y(d.ordinal);
  }

  getBarYQuantitative(d: BarDatum<TOrdinalValue>): number {
    if (this.isZeroOrNonNumeric(d.quantitative)) {
      const origin = this.getBarQuantitativeOrigin();
      return this.scales.y(origin);
    } else if (d.quantitative < 0) {
      if (this.config.quantitative.domainIncludesZero) {
        return this.scales.y(0);
      } else {
        return this.scales.y(this.getQuantitativeDomainFromScale()[1]);
      }
    } else {
      return this.scales.y(d.quantitative);
    }
  }

  getQuantitativeDomainFromScale(): number[] {
    return this.scales[this.config.dimensions.quantitative].domain();
  }

  getBarWidth(d: BarDatum<TOrdinalValue>): number {
    if (this.config.dimensions.quantitativeDimension === 'width') {
      return this.getBarDimensionQuantitative(d, 'x');
    } else {
      return this.getBarWidthOrdinal();
    }
  }

  getBarWidthOrdinal(): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.scales.x as any).bandwidth();
  }

  getBarHeight(d: BarDatum<TOrdinalValue>): number {
    if (this.config.dimensions.quantitativeDimension === 'height') {
      return this.getBarDimensionQuantitative(d, 'y');
    } else {
      return this.getBarHeightOrdinal();
    }
  }

  getBarHeightOrdinal(): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.scales.y as any).bandwidth();
  }

  getBarDimensionQuantitative(
    d: BarDatum<TOrdinalValue>,
    dimension: 'x' | 'y'
  ): number {
    if (this.isZeroOrNonNumeric(d.quantitative)) {
      return 0;
    }
    const origin = this.getBarQuantitativeOrigin();
    return Math.abs(
      this.scales[dimension](d.quantitative) - this.scales[dimension](origin)
    );
  }

  getBarQuantitativeOrigin(): number {
    if (this.config.quantitative.domainIncludesZero) {
      return 0;
    } else {
      const domain = this.getQuantitativeDomainFromScale();
      return this.config.hasNegativeValues ? domain[1] : domain[0];
    }
  }

  getBarPattern(d: BarDatum<TOrdinalValue>): string {
    const color = this.getBarColor(d);
    const patterns = this.config.color.fillDefs;
    return FillUtilities.getFill(this.config.data[d.index], color, patterns);
  }

  getBarColor(d: BarDatum<TOrdinalValue>): string {
    return this.scales.color(d.color);
  }

  getBarLabelText(d: BarDatum<TOrdinalValue>): string {
    const datum = this.config.data[d.index];
    if (!isNumber(d.quantitative)) {
      return this.config.labels.noValueFunction(datum);
    } else {
      return this.config.quantitative.formatFunction
        ? ValueUtilities.customFormat(
            datum,
            this.config.quantitative.formatFunction
          )
        : ValueUtilities.d3Format(
            d.quantitative,
            this.config.quantitative.formatSpecifier
          );
    }
  }

  getBarLabelTextAnchor(
    d: BarDatum<TOrdinalValue>
  ): 'start' | 'middle' | 'end' {
    if (this.config.dimensions.isVertical) {
      return 'middle';
    } else {
      return this.alignTextInPositiveDirection(d) ? 'start' : 'end';
    }
  }

  getBarLabelDominantBaseline(
    d: BarDatum<TOrdinalValue>
  ): 'text-after-edge' | 'text-before-edge' | 'central' {
    if (this.config.dimensions.isHorizontal) {
      return 'central';
    } else {
      return this.alignTextInPositiveDirection(d)
        ? 'text-after-edge'
        : 'text-before-edge';
    }
  }

  alignTextInPositiveDirection(d: BarDatum<TOrdinalValue>): boolean {
    if (this.isZeroOrNonNumeric(d.quantitative)) {
      return this.positionZeroOrNonNumericValueLabelInPositiveDirection();
    }
    const placeLabelOutsideBar = this.barLabelFitsOutsideBar(d);
    const isPositiveValue = d.quantitative > 0;
    return placeLabelOutsideBar ? isPositiveValue : !isPositiveValue;
  }

  getBarLabelColor(d: BarDatum<TOrdinalValue>): string {
    if (
      this.isZeroOrNonNumeric(d.quantitative) ||
      this.barLabelFitsOutsideBar(d)
    ) {
      return this.config.labels.color.default;
    } else {
      const barColor = this.getBarColor(d);
      return ColorUtilities.getHigherContrastColorForBackground(
        barColor,
        this.config.labels.color.default,
        this.config.labels.color.withinBarAlternative
      );
    }
  }

  barLabelFitsOutsideBar(d: BarDatum<TOrdinalValue>): boolean {
    const isPositiveValue = d.quantitative > 0;
    // This approach assumes that the bar labels do not wrap.
    const distance = this.getBarToChartEdgeDistance(
      isPositiveValue,
      this.ranges[this.config.dimensions.quantitative],
      this.scales[this.config.dimensions.quantitative](d.quantitative)
    );
    if (this.config.dimensions.isHorizontal) {
      return distance > this.getBarLabelWidth(d);
    } else {
      return distance > this.getBarLabelHeight(d);
    }
  }

  getBarToChartEdgeDistance(
    isPositiveValue: boolean,
    range: [number, number],
    barDimension: number
  ): number {
    return isPositiveValue
      ? Math.abs(range[1] - barDimension)
      : Math.abs(barDimension - range[0]);
  }

  getBarLabelWidth(d: BarDatum<TOrdinalValue>): number {
    const width = this.getLabelDomRect(d).width;
    return width + this.config.labels.offset;
  }

  getBarLabelHeight(d: BarDatum<TOrdinalValue>): number {
    const height = this.getLabelDomRect(d).height;
    return height + this.config.labels.offset;
  }

  getLabelDomRect(d: BarDatum<TOrdinalValue>): DOMRect {
    const selection = selectAll<SVGTextElement, BarDatum<TOrdinalValue>>(
      '.vic-bar-label'
    ).filter((datum) => datum.index === d.index);
    return selection.node().getBoundingClientRect();
  }

  getBarLabelX(d: BarDatum<TOrdinalValue>): number {
    if (this.config.dimensions.x === 'ordinal') {
      return this.getBarWidthOrdinal() / 2;
    } else {
      return this.getBarLabelQuantitativeAxisPosition(d);
    }
  }

  getBarLabelY(d: BarDatum<TOrdinalValue>): number {
    if (this.config.dimensions.y === 'ordinal') {
      return this.getBarHeightOrdinal() / 2;
    } else {
      return this.getBarLabelQuantitativeAxisPosition(d);
    }
  }

  getBarLabelQuantitativeAxisPosition(d: BarDatum<TOrdinalValue>): number {
    if (this.isZeroOrNonNumeric(d.quantitative)) {
      return this.getBarLabelPositionForZeroOrNonnumericValue();
    } else {
      return this.getBarLabelPositionForNumericValue(d);
    }
  }

  getBarLabelPositionForZeroOrNonnumericValue(): number {
    const positionInPositiveDirection =
      this.positionZeroOrNonNumericValueLabelInPositiveDirection();
    return (positionInPositiveDirection &&
      this.config.dimensions.isHorizontal) ||
      (!positionInPositiveDirection && this.config.dimensions.isVertical)
      ? this.config.labels.offset
      : -this.config.labels.offset;
  }

  getBarLabelPositionForNumericValue(d: BarDatum<TOrdinalValue>): number {
    const isPositiveValue = d.quantitative > 0;
    const origin = this.getBarLabelOrigin(d, isPositiveValue);
    const placeLabelOutsideBar = this.barLabelFitsOutsideBar(d);
    if (
      (this.config.dimensions.isVertical && placeLabelOutsideBar) ||
      (this.config.dimensions.isHorizontal && !placeLabelOutsideBar)
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

  getBarLabelOrigin(
    d: BarDatum<TOrdinalValue>,
    isPositiveValue: boolean
  ): number {
    if (this.config.dimensions.isHorizontal) {
      return isPositiveValue ? this.getBarDimensionQuantitative(d, 'x') : 0;
    } else {
      return isPositiveValue ? 0 : this.getBarDimensionQuantitative(d, 'y');
    }
  }

  positionZeroOrNonNumericValueLabelInPositiveDirection(): boolean {
    const quantitativeValues = this.config.quantitative.values;
    const someValuesArePositive = quantitativeValues.some((x) => x > 0);
    if (someValuesArePositive) {
      return true;
    } else {
      const domainMaxIsGreaterThanZero =
        this.getQuantitativeDomainFromScale()[1] > 0;
      const everyValueIsEitherZeroOrNonnumeric = quantitativeValues.every((x) =>
        this.isZeroOrNonNumeric(x)
      );
      return domainMaxIsGreaterThanZero && everyValueIsEitherZeroOrNonnumeric;
    }
  }

  isZeroOrNonNumeric(value: unknown): boolean {
    return value === 0 || !isNumber(value);
  }

  updateBarElements(): void {
    const bars = select(this.barsRef.nativeElement).selectAll<
      SVGRectElement,
      number
    >('.vic-bar');
    const barLabels = select(this.barsRef.nativeElement).selectAll<
      SVGTextElement,
      number
    >('.vic-bar-label');
    this.bars.next(bars);
    this.barLabels.next(barLabels);
  }

  getTooltipData(
    barDatum: BarDatum<TOrdinalValue>,
    elRef: ElementRef
  ): BarsTooltipDatum<Datum, TOrdinalValue> {
    const datum = this.getUserDatumFromBarDatum(barDatum);

    const tooltipData: BarsTooltipDatum<Datum, TOrdinalValue> = {
      datum,
      color: this.getBarColor(barDatum),
      ordinal: this.config.ordinal.valueAccessor(datum),
      quantitative: this.config.quantitative.formatFunction
        ? ValueUtilities.customFormat(
            datum,
            this.config.quantitative.formatFunction
          )
        : ValueUtilities.d3Format(
            this.config.quantitative.valueAccessor(datum),
            this.config.quantitative.formatSpecifier
          ),
      category: this.config.color.valueAccessor(datum),
      elRef: elRef,
    };
    return tooltipData;
  }

  getUserDatumFromBarDatum(barDatum: BarDatum<TOrdinalValue>): Datum {
    return this.config.data.find(
      (d) =>
        this.config.ordinal.values[barDatum.index] ===
          this.config.ordinal.valueAccessor(d) &&
        this.config.quantitative.values[barDatum.index] ===
          this.config.quantitative.valueAccessor(d)
    );
  }
}
