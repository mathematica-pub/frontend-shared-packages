import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  NgZone,
} from '@angular/core';
import { Transition, area, select } from 'd3';
import { ChartComponent, XyChartComponent, XyChartScales } from '../charts';
import { GenericScale } from '../core';
import { DataValue } from '../core/types/values';
import { ValueUtilities } from '../core/utilities/values';
import { VIC_PRIMARY_MARKS } from '../marks/primary-marks/primary-marks';
import { VicXyPrimaryMarks } from '../marks/xy-marks/xy-primary-marks/xy-primary-marks';
import { StackedAreaConfig } from './config/stacked-area-config';
import {
  StackedAreaEventOutput,
  StackedAreaTooltipDatum,
} from './events/stacked-area-event-output';

// Ideally we would be able to use generic T with the component, but Angular doesn't yet support this, so we use unknown instead
// https://github.com/angular/angular/issues/46815, https://github.com/angular/angular/pull/47461
export const STACKED_AREA = new InjectionToken<
  StackedAreaComponent<unknown, DataValue>
>('StackedAreaComponent');

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-primary-marks-stacked-area]',
  templateUrl: './stacked-area.component.html',
  styleUrls: ['./stacked-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_PRIMARY_MARKS, useExisting: StackedAreaComponent },
    { provide: STACKED_AREA, useExisting: StackedAreaComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
})
export class StackedAreaComponent<
  Datum,
  TCategoricalValue extends DataValue,
> extends VicXyPrimaryMarks<
  Datum,
  StackedAreaConfig<Datum, TCategoricalValue>
> {
  area;
  areas;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override scales: { color: GenericScale<any, any> } & XyChartScales;

  constructor(
    private areasRef: ElementRef<SVGSVGElement>,
    private zone: NgZone
  ) {
    super();
  }

  setChartScalesFromRanges(useTransition: boolean): void {
    const x = this.config.x.getScaleFromRange(this.ranges.x);
    const y = this.config.y.getScaleFromRange(this.ranges.y);
    this.scales.color = this.config.color.getScale();
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
    const transitionDuration = this.getTransitionDuration();
    this.setArea();
    this.drawAreas(transitionDuration);
  }

  setArea(): void {
    this.area = area()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .x(({ i }: any) => this.scales.x(this.config.x.values[i]))
      .y0(([y1]) => this.scales.y(y1))
      .y1(([, y2]) => this.scales.y(y2))
      .curve(this.config.curve);
  }

  drawAreas(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.areas = select(this.areasRef.nativeElement)
      .selectAll('path')
      .data(this.config.series)
      .join(
        (enter) =>
          enter
            .append('path')
            .property('key', ([{ i }]) => this.config.color.values[i])
            .attr('fill', ([{ i }]) =>
              this.scales.color(this.config.color.values[i])
            )
            .attr('d', this.area),
        (update) =>
          update.call((update) =>
            update
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .transition(t as any)
              .attr('d', this.area)
              .attr('fill', ([{ i }]) =>
                this.scales.color(this.config.color.values[i])
              )
          ),
        (exit) => exit.remove()
      );
  }

  getTooltipData(
    closestXIndicies: number[],
    categoryYMin: number,
    categoryYMax: number,
    categoryIndex: number
  ): StackedAreaEventOutput<Datum, TCategoricalValue> {
    const data: StackedAreaTooltipDatum<Datum, TCategoricalValue>[] =
      closestXIndicies.map((i) => {
        const datum = this.getDatumFromIndex(i);
        return {
          datum: datum,
          x: this.getXyDimensionValue(datum, 'x'),
          y: this.getXyDimensionValue(datum, 'y'),
          category: this.config.color.valueAccessor(datum),
          color: this.scales.color(this.config.color.valueAccessor(datum)),
        };
      });
    if (this.config.categoricalOrder) {
      this.sortTooltipDataByCategoricalSortOrder(data);
      categoryIndex = closestXIndicies.length - categoryIndex;
    }
    return {
      data,
      positionX: this.scales.x(this.config.x.values[closestXIndicies[0]]),
      categoryYMin: categoryYMin,
      categoryYMax: categoryYMax,
      hoveredDatum: data[categoryIndex],
    };
  }

  private getDatumFromIndex(i: number) {
    return this.config.data.find(
      (d) =>
        this.config.x.valueAccessor(d) === this.config.x.values[i] &&
        this.config.color.valueAccessor(d) === this.config.color.values[i]
    );
  }

  private getXyDimensionValue(datum: Datum, dimension: 'x' | 'y'): string {
    return this.config[dimension].formatFunction
      ? ValueUtilities.customFormat(
          datum,
          this.config[dimension].formatFunction
        )
      : ValueUtilities.d3Format(
          this.config[dimension].valueAccessor(datum),
          this.config[dimension].formatSpecifier
        );
  }

  private sortTooltipDataByCategoricalSortOrder(
    data: StackedAreaTooltipDatum<Datum, TCategoricalValue>[]
  ) {
    if (this.config.categoricalOrder) {
      data.sort((a, b) => {
        return (
          this.config.categoricalOrder.indexOf(a.category) -
          this.config.categoricalOrder.indexOf(b.category)
        );
      });
    }
  }
}
