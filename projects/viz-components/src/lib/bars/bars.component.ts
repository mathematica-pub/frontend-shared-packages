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
import { range, select, Transition } from 'd3';
import { Selection } from 'd3-selection';
import { BehaviorSubject } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { VicDataValue } from '../data-marks/dimensions/data-dimension';
import { PatternUtilities } from '../shared/pattern-utilities.class';
import { formatValue } from '../value-format/value-format';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { XyDataMarksBase } from '../xy-data-marks/xy-data-marks-base';
import { VicBarsConfig, VicBarsTooltipData } from './bars.config';

// Ideally we would be able to use generic T with the component, but Angular doesn't yet support this, so we use unknown instead
// https://github.com/angular/angular/issues/46815, https://github.com/angular/angular/pull/47461
export const BARS = new InjectionToken<BarsComponent<unknown, VicDataValue>>(
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
export class BarsComponent<
  Datum,
  TOrdinalValue extends VicDataValue
> extends XyDataMarksBase<Datum, VicBarsConfig<Datum, TOrdinalValue>> {
  @ViewChild('bars', { static: true }) barsRef: ElementRef<SVGSVGElement>;
  @Output() tooltipData = new EventEmitter<VicBarsTooltipData>();
  hasBarsWithNegativeValues: boolean;
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
    this.setValueIndicies();
    this.setHasBarsWithNegativeValues();
    this.setBarsKeyFunction();
  }

  setValueArrays(): void {
    this.config.quantitative.setPropertiesFromData(this.config.data);
    this.config.ordinal.setPropertiesFromData(
      this.config.data,
      this.config.dimensions.ordinal === 'y'
    );
    this.config.category.setPropertiesFromData(this.config.data);
  }

  setHasBarsWithNegativeValues(): void {
    this.hasBarsWithNegativeValues =
      this.config.quantitative.unpaddedDomain[0] < 0;
  }

  setValueIndicies(): void {
    this.valueIndicies = range(this.config.ordinal.values.length).filter((i) =>
      this.config.ordinal.domain.includes(this.config.ordinal.values[i])
    );
  }

  setBarsKeyFunction(): void {
    this.barsKeyFunction = (i: number): string =>
      `${this.config.ordinal.values[i]}`;
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
    const x = this.config[this.config.dimensions.x].getScaleFromRange(
      this.ranges.x
    );
    const y = this.config[this.config.dimensions.y].getScaleFromRange(
      this.ranges.y
    );
    const category = this.config.category.scale;
    this.zone.run(() => {
      this.chart.updateScales({ x, y, category, useTransition });
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
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.barGroups = select(this.barsRef.nativeElement)
      .selectAll<SVGGElement, number>('.vic-bar-group')
      .data<number>(this.valueIndicies, this.barsKeyFunction)
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

  getBarKey(i: number): TOrdinalValue {
    return this.config.ordinal.values[i];
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

  drawBarLabels(transitionDuration): void {
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
            .attr('y', (i) => this.getBarLabelY(i)),
        (update) =>
          update
            .transition(t as any)
            .text((i) => this.getBarLabelText(i))
            .style('fill', (i) => this.getBarLabelColor(i))
            .attr('x', (i) => this.getBarLabelX(i))
            .attr('y', (i) => this.getBarLabelY(i)),
        (exit) => exit.remove()
      );
  }

  getBarLabelText(i: number): string {
    const value = this.config.quantitative.values[i];
    const datum = this.config.data[i];
    if (value === null || value === undefined) {
      return this.config.labels.noValueFunction(datum);
    } else if (typeof this.config.quantitative.valueFormat === 'function') {
      return formatValue(datum, this.config.quantitative.valueFormat);
    } else {
      return formatValue(value, this.config.quantitative.valueFormat);
    }
  }

  getBarLabelColor(i: number): string {
    return this.config.labels.color ?? this.getBarColor(i);
  }

  getBarColor(i: number): string {
    return this.scales.category(this.config.ordinal.values[i]);
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

  getBarX(i: number): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarXOrdinal(i);
    } else {
      return this.getBarXQuantitative(i);
    }
  }

  getBarXOrdinal(i: number): number {
    return this.scales.x(this.config.ordinal.values[i]);
  }

  getBarXQuantitative(i: number): number {
    if (this.hasBarsWithNegativeValues) {
      if (this.config.quantitative.values[i] < 0) {
        return this.scales.x(this.config.quantitative.values[i]);
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
    return this.scales.y(this.config[this.config.dimensions.y].values[i]);
  }

  getBarWidth(i: number): number {
    let width;
    if (this.config.dimensions.ordinal === 'x') {
      width = this.getBarWidthOrdinal(i);
    } else {
      width = this.getBarWidthQuantitative(i);
    }
    if (!width || isNaN(width)) {
      width = 0;
    }
    return width;
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
    return (this.scales.x as any).bandwidth();
  }

  getBarWidthQuantitative(i: number): number {
    let origin;
    if (this.config.quantitative.domainIncludesZero) {
      origin = this.hasBarsWithNegativeValues
        ? 0
        : this.getQuantitativeDomainFromScale()[0];
    } else {
      origin = this.hasBarsWithNegativeValues
        ? this.getQuantitativeDomainFromScale()[1]
        : this.getQuantitativeDomainFromScale()[0];
    }
    return Math.abs(
      this.scales.x(this.config.quantitative.values[i]) - this.scales.x(origin)
    );
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
    return (this.scales.y as any).bandwidth();
  }

  getBarHeightQuantitative(i: number): number {
    const origin = this.hasBarsWithNegativeValues
      ? 0
      : this.getQuantitativeDomainFromScale()[0];
    return Math.abs(this.scales.y(origin - this.config.quantitative.values[i]));
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
