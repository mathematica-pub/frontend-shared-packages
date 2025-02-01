import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { BaseType, SeriesPoint, Transition, select } from 'd3';
import { Selection } from 'd3-selection';
import { BarsComponent } from '../bars/bars.component';
import { ChartComponent, XyChartComponent } from '../charts';
import { DataValue } from '../core/types/values';
import { VIC_PRIMARY_MARKS } from '../marks/primary-marks/primary-marks';
import { StackedBarsConfig } from './config/stacked-bars-config';

export type StackDatum = SeriesPoint<{ [key: string]: number }> & {
  i: number;
};

export type StackedBarGroupSelection = Selection<
  BaseType | SVGRectElement,
  StackDatum,
  SVGGElement | BaseType,
  StackDatum[]
>;

// Ideally we would be able to use generic T with the component, but Angular doesn't yet support this, so we use "unknown"
// https://github.com/angular/angular/issues/46815, https://github.com/angular/angular/pull/47461
export const STACKED_BARS = new InjectionToken<
  StackedBarsComponent<unknown, DataValue>
>('StackedBarsComponent');

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-primary-marks-stacked-bars]',
  template: '',
  styleUrls: ['./stacked-bars.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_PRIMARY_MARKS, useExisting: StackedBarsComponent },
    { provide: STACKED_BARS, useExisting: StackedBarsComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
  host: {
    '[class]': 'config.class',
    '[style.mixBlendMode]': 'config.mixBlendMode',
  },
})
export class StackedBarsComponent<
  Datum,
  TOrdinalValue extends DataValue,
> extends BarsComponent<Datum, TOrdinalValue> {
  @Input() override config: StackedBarsConfig<Datum, TOrdinalValue>;
  stackedBarGroups: StackedBarGroupSelection;

  override drawBars(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.stackedBarGroups = select(this.elRef.nativeElement)
      .selectAll<SVGGElement, StackDatum[]>(
        `.${this.config.marksClass}-category-group`
      )
      .data<StackDatum[]>(this.config.stackedData)
      .join('g')
      .attr('class', `${this.config.marksClass}-category-group`.trim())
      .attr('fill', ([{ i }]: StackDatum[]) =>
        this.scales.color(this.config.color.values[i])
      )
      .selectAll(`.${this.class.g}`)
      .data((d) => d)
      .join((enter) =>
        enter
          .append('g')
          .attr('class', (d) =>
            `${this.class.g} ${this.config.datumClass(this.config.data[d.i], d.i)}`.trim()
          )
      );

    this.stackedBarGroups
      .selectAll(`.${this.class.bar}`)
      .data((d) => [d])
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', () => this.class.bar)
            .attr('x', (d) => this.getStackElementX(d))
            .attr('y', (d) => this.getStackElementY(d))
            .attr('width', (d) => this.getStackElementWidth(d))
            .attr('height', (d) => this.getStackElementHeight(d)),
        (update) =>
          update.call((update) =>
            update
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .transition(t as any)
              .attr('x', (d) => this.getStackElementX(d))
              .attr('y', (d) => this.getStackElementY(d))
              .attr('width', (d) => this.getStackElementWidth(d))
              .attr('height', (d) => this.getStackElementHeight(d))
          ),
        (exit) =>
          exit // fancy exit needs to be tested with actual/any data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition(t as any)
            .delay((_, i) => i * 20)
            .attr('y', this.scales.y(0))
            .attr('height', 0)
            .remove()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      );
  }

  getStackElementX(datum: StackDatum): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.scales.x(
        this.config[this.config.dimensions.x].values[datum.i]
      );
    } else {
      return Math.min(this.scales.x(datum[0]), this.scales.x(datum[1]));
    }
  }

  getStackElementY(datum: StackDatum): number {
    if (this.config.dimensions.ordinal === 'x') {
      return Math.min(this.scales.y(datum[0]), this.scales.y(datum[1]));
    } else {
      return this.scales.y(
        this.config[this.config.dimensions.y].values[datum.i]
      );
    }
  }

  getStackElementWidth(datum: StackDatum): number {
    if (this.config.dimensions.ordinal === 'x') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (this.scales.x as any).bandwidth();
    } else {
      return Math.abs(this.scales.x(datum[0]) - this.scales.x(datum[1]));
    }
  }

  getStackElementHeight(datum: StackDatum): number {
    if (this.config.dimensions.ordinal === 'x') {
      return Math.abs(this.scales.y(datum[0]) - this.scales.y(datum[1]));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (this.scales.y as any).bandwidth();
    }
  }

  getSourceDatumFromStackedBarDatum(datum: StackDatum): Datum {
    return this.config.data[datum.i];
  }
}
