import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectionToken,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import { select, Transition } from 'd3';
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
  values: {
    x: TOrdinalValue | string;
    y: TOrdinalValue | string;
    category: string;
  };
}

type BarsSvgElement = 'g' | 'bar' | 'label' | 'background';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-primary-marks-bars]',
  template: '',
  styleUrls: ['./bars.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_PRIMARY_MARKS, useExisting: BarsComponent },
    { provide: BARS, useExisting: BarsComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
  host: {
    '[class]': 'config.marksClass',
    '[style.mixBlendMode]': 'config.mixBlendMode',
  },
})
export class BarsComponent<
  Datum,
  TOrdinalValue extends DataValue,
> extends VicXyPrimaryMarks<Datum, BarsConfig<Datum, TOrdinalValue>> {
  barGroups: BarGroupSelection;
  bars: BehaviorSubject<BarSelection> = new BehaviorSubject(null);
  bars$ = this.bars.asObservable();
  labels: BehaviorSubject<BarLabelSelection> = new BehaviorSubject(null);
  labels$ = this.bars.asObservable();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override scales: { color: GenericScale<any, any> } & XyChartScales = {
    x: undefined,
    y: undefined,
    color: undefined,
    useTransition: undefined,
  };
  protected zone = inject(NgZone);
  public elRef = inject(ElementRef<SVGGElement>);

  get class(): Record<BarsSvgElement, string> {
    return {
      g: this.config.marksClass + '-group',
      bar: this.config.marksClass + '-bar',
      label: this.config.marksClass + '-label',
      background: this.config.marksClass + '-background',
    };
  }

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
    if (this.config.backgrounds) {
      this.drawBackgrounds(transitionDuration);
    }
    if (this.config.labels) {
      // must delay so that it can get the correct dimensions of the labels rather than 0 0 0 0.
      requestAnimationFrame(() => {
        this.drawLabels(transitionDuration);
      });
    }
    this.updateBarElements();
  }

  drawBars(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.barGroups = select(this.elRef.nativeElement)
      .selectAll<SVGGElement, number>(`.${this.class.g}`)
      .data<number>(this.config.valueIndices, this.config.barsKeyFunction)
      .join(
        (enter) =>
          enter
            .append('g')
            .attr('class', (i) =>
              `${this.class.g} ${this.config.datumClass(this.config.data[i], i)}`.trim()
            )
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
      .selectAll<SVGRectElement, BarDatum<TOrdinalValue>>(`.${this.class.bar}`)
      .data<BarDatum<TOrdinalValue>>((i) => [this.getBarDatumFromIndex(i)])
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', this.class.bar)
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

  drawBackgrounds(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.barGroups
      .selectAll<SVGRectElement, number>(`.${this.class.background}`)
      .data<BarDatum<TOrdinalValue>>((i) => [this.getBarDatumFromIndex(i)])
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', this.class.background)
            .attr('fill', this.config.backgrounds.color)
            .attr('transform', (d) => this.getBackgroundTransform(d))
            .attr('width', this.getBackgroundWidth())
            .attr('height', this.getBackgroundBarHeight()),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .attr('transform', (d) => this.getBackgroundTransform(d))
            .attr('width', this.getBackgroundWidth())
            .attr('height', this.getBackgroundBarHeight()),
        (exit) => exit.remove()
      )
      .lower();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBarGroupColorClass(i: number): string {
    return this.config.color.calculatedDomain.length > 1
      ? ValueUtilities.formatForHtmlAttribute(this.config.color.values[i])
      : '';
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
    return this.config.customFills
      ? this.getBarPattern(datum)
      : this.getBarColor(datum);
  }

  drawLabels(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.barGroups
      .selectAll<SVGTextElement, BarDatum<TOrdinalValue>>(
        `.${this.class.label}`
      )
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
            .attr('class', this.class.label)
            .style('display', this.config.labels.display ? null : 'none')
            .text((d) => this.getLabelText(d))
            .style('visibility', 'hidden')
            .call((selection) => {
              selection.each((d, i, nodes) => {
                const bbox = nodes[i].getBBox();
                select<SVGTextElement, BarDatum<TOrdinalValue>>(nodes[i])
                  .style('fill', (d) => this.getLabelColor(d, bbox))
                  .attr('text-anchor', (d) => this.getLabelTextAnchor(d, bbox))
                  .attr('dominant-baseline', (d) =>
                    this.getLabelDominantBaseline(d, bbox)
                  )
                  .attr('x', this.getLabelX(d, bbox))
                  .attr('y', this.getLabelY(d, bbox))
                  .attr('visibility', 'visible');
              });
            }),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .text((d) => this.getLabelText(d))
            .style('visiblity', 'hidden')
            .call((selection) => {
              selection.each((d, i, nodes) => {
                const bbox = nodes[i].getBBox();
                select<SVGTextElement, BarDatum<TOrdinalValue>>(nodes[i])
                  .style('fill', (d) => this.getLabelColor(d, bbox))
                  .attr('text-anchor', (d) => this.getLabelTextAnchor(d, bbox))
                  .attr('dominant-baseline', (d) =>
                    this.getLabelDominantBaseline(d, bbox)
                  )
                  .attr('x', this.getLabelX(d, bbox))
                  .attr('y', this.getLabelY(d, bbox))
                  .attr('visibility', 'visible');
              });
            }),
        (exit) => exit.remove()
      );
  }

  getBarX(d: BarDatum<TOrdinalValue>): number {
    if (this.config.dimensions.x === 'ordinal') {
      return this.getBarXOrdinal(d);
    }
    return this.getBarXQuantitative(d);
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
      }
      return this.scales.x(0);
    }
    return this.scales.x(this.getQuantitativeDomainFromScale()[0]);
  }

  getBarY(d: BarDatum<TOrdinalValue>): number {
    if (this.config.dimensions.y === 'ordinal') {
      return this.getBarYOrdinal(d);
    }
    return this.getBarYQuantitative(d);
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
      }
      return this.scales.y(this.getQuantitativeDomainFromScale()[1]);
    }
    return this.scales.y(d.quantitative);
  }

  getQuantitativeDomainFromScale(): number[] {
    return this.scales[this.config.dimensions.quantitative].domain();
  }

  getBarWidth(d: BarDatum<TOrdinalValue>): number {
    if (this.config.dimensions.quantitativeDimension === 'width') {
      return this.getBarDimensionQuantitative(d, 'x');
    }
    return this.getBarWidthOrdinal();
  }

  getBarWidthOrdinal(): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.scales.x as any).bandwidth();
  }

  getBarHeight(d: BarDatum<TOrdinalValue>): number {
    if (this.config.dimensions.quantitativeDimension === 'height') {
      return this.getBarDimensionQuantitative(d, 'y');
    }
    return this.getBarHeightOrdinal();
  }

  getBarHeightOrdinal(): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.scales.y as any).bandwidth();
  }

  getBackgroundTransform(d: BarDatum<TOrdinalValue>): string | null {
    if (this.config.dimensions.quantitativeDimension === 'width') {
      const range = this.scales.x.range();
      const offsetFromLeft =
        d.quantitative < 0 ? this.scales.x(d.quantitative) : this.scales.x(0);
      return `translate(${range[0] - offsetFromLeft},0)`;
    }
    const range = this.scales.y.range();
    const offsetFromBottom =
      d.quantitative < 0 ? this.scales.y(0) : this.scales.y(d.quantitative);
    return `translate(0,${range[1] - offsetFromBottom})`;
  }

  getBackgroundWidth(): number {
    if (this.config.dimensions.quantitativeDimension === 'width') {
      const range = this.scales.x.range();
      return range[1] - range[0];
    }
    return this.getBarWidthOrdinal();
  }

  getBackgroundBarHeight(): number {
    if (this.config.dimensions.quantitativeDimension === 'height') {
      const range = this.scales.y.range();
      return range[0] - range[1];
    } else {
      return this.getBarHeightOrdinal();
    }
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
    }
    const domain = this.getQuantitativeDomainFromScale();
    return this.config.hasNegativeValues ? domain[1] : domain[0];
  }

  getBarPattern(d: BarDatum<TOrdinalValue>): string {
    const color = this.getBarColor(d);
    return FillUtilities.getFill(
      this.config.data[d.index],
      color,
      this.config.customFills
    );
  }

  getBarColor(d: BarDatum<TOrdinalValue>): string {
    return this.scales.color(d.color);
  }

  getLabelText(d: BarDatum<TOrdinalValue>): string {
    const datum = this.config.data[d.index];
    if (!isNumber(d.quantitative)) {
      return this.config.labels.noValueFunction(datum);
    }
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

  getLabelTextAnchor(
    d: BarDatum<TOrdinalValue>,
    labelBbox: DOMRect
  ): 'start' | 'middle' | 'end' {
    if (this.config.dimensions.isVertical) {
      return 'middle';
    }
    return this.alignTextInPositiveDirection(d, labelBbox) ? 'start' : 'end';
  }

  getLabelDominantBaseline(
    d: BarDatum<TOrdinalValue>,
    labelBbox: DOMRect
  ): 'text-after-edge' | 'text-before-edge' | 'central' {
    if (this.config.dimensions.isHorizontal) {
      return 'central';
    }
    return this.alignTextInPositiveDirection(d, labelBbox)
      ? 'text-after-edge'
      : 'text-before-edge';
  }

  alignTextInPositiveDirection(
    d: BarDatum<TOrdinalValue>,
    labelBbox: DOMRect
  ): boolean {
    if (this.isZeroOrNonNumeric(d.quantitative)) {
      return this.positionZeroOrNonNumericValueLabelInPositiveDirection();
    }
    const placeLabelOutsideBar = this.labelFitsOutsideBar(d, labelBbox);
    const isPositiveValue = d.quantitative > 0;
    return placeLabelOutsideBar ? isPositiveValue : !isPositiveValue;
  }

  getLabelColor(d: BarDatum<TOrdinalValue>, labelBbox: DOMRect): string {
    if (
      this.isZeroOrNonNumeric(d.quantitative) ||
      this.labelFitsOutsideBar(d, labelBbox)
    ) {
      if (this.config.backgrounds) {
        // try to use the default label color if it has enough contrast
        if (
          ColorUtilities.getContrastRatio(
            this.config.labels.color.default,
            this.config.backgrounds.color
          ) >= 4.5
        ) {
          return this.config.labels.color.default;
        }
        // if it doesn't, user the color with the higher contrast against the background
        return ColorUtilities.getHigherContrastColorForBackground(
          this.config.backgrounds.color,
          this.config.labels.color.default,
          this.config.labels.color.withinBarAlternative
        );
      }
      return this.config.labels.color.default;
    }
    const barColor = this.getBarColor(d);
    return ColorUtilities.getHigherContrastColorForBackground(
      barColor,
      this.config.labels.color.default,
      this.config.labels.color.withinBarAlternative
    );
  }

  labelFitsOutsideBar(d: BarDatum<TOrdinalValue>, labelBbox: DOMRect): boolean {
    const isPositiveValue = d.quantitative > 0;
    // This approach assumes that the bar labels do not wrap.
    const distanceToChartEdge = this.getBarToChartEdgeDistance(
      isPositiveValue,
      this.ranges[this.config.dimensions.quantitative],
      this.scales[this.config.dimensions.quantitative](d.quantitative)
    );

    if (this.config.dimensions.isHorizontal) {
      return distanceToChartEdge > labelBbox.width + this.config.labels.offset;
    }
    return distanceToChartEdge > labelBbox.height + this.config.labels.offset;
  }

  getBarToChartEdgeDistance(
    isPositiveValue: boolean,
    range: [number, number],
    endOfBarPosition: number
  ): number {
    const [min, max] = range[0] < range[1] ? range : [range[1], range[0]];

    if (endOfBarPosition <= min || endOfBarPosition >= max) {
      return 0;
    }

    return isPositiveValue ? max - endOfBarPosition : endOfBarPosition - min;
  }

  getLabelDomRect(d: BarDatum<TOrdinalValue>): DOMRect {
    const selection = this.barGroups
      .selectAll<
        SVGTextElement,
        BarDatum<TOrdinalValue>
      >(`.${this.class.label}`)
      .filter((datum) => datum.index === d.index);
    return selection.node().getBoundingClientRect();
  }

  getLabelX(d: BarDatum<TOrdinalValue>, bbox: DOMRect): number {
    if (this.config.dimensions.x === 'ordinal') {
      return this.getBarWidthOrdinal() / 2;
    }
    return this.getLabelQuantitativeAxisPosition(d, bbox);
  }

  getLabelY(d: BarDatum<TOrdinalValue>, bbox: DOMRect): number {
    if (this.config.dimensions.y === 'ordinal') {
      return this.getBarHeightOrdinal() / 2;
    }
    return this.getLabelQuantitativeAxisPosition(d, bbox);
  }

  getLabelQuantitativeAxisPosition(
    d: BarDatum<TOrdinalValue>,
    bbox: DOMRect
  ): number {
    if (this.isZeroOrNonNumeric(d.quantitative)) {
      return this.getLabelPositionForZeroOrNonnumericValue();
    }
    return this.getLabelPositionForNumericValue(d, bbox);
  }

  getLabelPositionForZeroOrNonnumericValue(): number {
    const positionInPositiveDirection =
      this.positionZeroOrNonNumericValueLabelInPositiveDirection();
    return (positionInPositiveDirection &&
      this.config.dimensions.isHorizontal) ||
      (!positionInPositiveDirection && this.config.dimensions.isVertical)
      ? this.config.labels.offset
      : -this.config.labels.offset;
  }

  getLabelPositionForNumericValue(
    d: BarDatum<TOrdinalValue>,
    bbox: DOMRect
  ): number {
    const isPositiveValue = d.quantitative > 0;
    const origin = this.getLabelOrigin(d, isPositiveValue);
    const placeLabelOutsideBar = this.labelFitsOutsideBar(d, bbox);
    if (
      (this.config.dimensions.isVertical && placeLabelOutsideBar) ||
      (this.config.dimensions.isHorizontal && !placeLabelOutsideBar)
    ) {
      return isPositiveValue
        ? origin - this.config.labels.offset
        : origin + this.config.labels.offset;
    }
    return isPositiveValue
      ? origin + this.config.labels.offset
      : origin - this.config.labels.offset;
  }

  getLabelOrigin(d: BarDatum<TOrdinalValue>, isPositiveValue: boolean): number {
    if (this.config.dimensions.isHorizontal) {
      return isPositiveValue ? this.getBarDimensionQuantitative(d, 'x') : 0;
    }
    return isPositiveValue ? 0 : this.getBarDimensionQuantitative(d, 'y');
  }

  positionZeroOrNonNumericValueLabelInPositiveDirection(): boolean {
    const quantitativeValues = this.config.quantitative.values;
    const someValuesArePositive = quantitativeValues.some((x) => x > 0);
    if (someValuesArePositive) {
      return true;
    }
    const domainMaxIsGreaterThanZero =
      this.getQuantitativeDomainFromScale()[1] > 0;
    const everyValueIsEitherZeroOrNonnumeric = quantitativeValues.every((x) =>
      this.isZeroOrNonNumeric(x)
    );
    return domainMaxIsGreaterThanZero && everyValueIsEitherZeroOrNonnumeric;
  }

  isZeroOrNonNumeric(value: unknown): boolean {
    return value === 0 || !isNumber(value);
  }

  updateBarElements(): void {
    const barEventElementsSelector = this.config.backgrounds?.events
      ? `.${this.class.bar}, .${this.class.background}`
      : `.${this.class.bar}`;
    const bars = select(this.elRef.nativeElement).selectAll<
      SVGRectElement,
      number
    >(barEventElementsSelector);
    const labels = select(this.elRef.nativeElement).selectAll<
      SVGTextElement,
      number
    >(`.${this.class.label}`);
    this.bars.next(bars);
    this.labels.next(labels);
  }

  getTooltipData(datum: Datum): BarsTooltipDatum<Datum, TOrdinalValue> {
    const ordinalValue = this.config.ordinal.formatFunction
      ? ValueUtilities.customFormat(datum, this.config.ordinal.formatFunction)
      : this.config.ordinal.valueAccessor(datum);
    const quantitativeValue = this.config.quantitative.formatFunction
      ? ValueUtilities.customFormat(
          datum,
          this.config.quantitative.formatFunction
        )
      : ValueUtilities.d3Format(
          this.config.quantitative.valueAccessor(datum),
          this.config.quantitative.formatSpecifier
        );
    const category = this.config.color.valueAccessor(datum);
    const tooltipData: BarsTooltipDatum<Datum, TOrdinalValue> = {
      datum,
      color: this.scales.color(category),
      values: {
        x:
          this.config.dimensions.x === 'ordinal'
            ? ordinalValue
            : quantitativeValue,
        y:
          this.config.dimensions.y === 'ordinal'
            ? ordinalValue
            : quantitativeValue,
        category,
      },
    };
    return tooltipData;
  }

  getSourceDatumFromBarDatum(barDatum: BarDatum<TOrdinalValue>): Datum {
    return this.config.data.find(
      (d) =>
        this.config.ordinal.values[barDatum.index] ===
          this.config.ordinal.valueAccessor(d) &&
        this.config.quantitative.values[barDatum.index] ===
          this.config.quantitative.valueAccessor(d)
    );
  }
}
