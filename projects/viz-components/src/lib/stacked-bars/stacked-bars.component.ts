import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { SeriesPoint, Transition, select } from 'd3';
import { BarsComponent } from '../bars/bars.component';
import { DataValue } from '../core/types/values';
import { VIC_PRIMARY_MARKS } from '../marks/primary-marks/primary-marks';
import { StackedBarsConfig } from './config/stacked-bars-config';

export type StackDatum = SeriesPoint<{ [key: string]: number }> & {
  i: number;
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-primary-marks-stacked-bars]',
  templateUrl: '../bars/bars.component.html',
  styleUrls: ['./stacked-bars.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_PRIMARY_MARKS, useExisting: StackedBarsComponent },
  ],
})
export class StackedBarsComponent<
  Datum,
  TOrdinalValue extends DataValue,
> extends BarsComponent<Datum, TOrdinalValue> {
  @Input() override config: StackedBarsConfig<Datum, TOrdinalValue>;

  override drawBars(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.barGroups = select(this.barsRef.nativeElement)
      .selectAll('g')
      .data(this.config.stackedData)
      .join('g')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr('fill', ([{ i }]: any) =>
        this.scales.categorical(this.config.categorical.values[i])
      )
      .selectAll('rect')
      .data((d) => d)
      .join(
        (enter) =>
          enter
            .append('rect')
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
      ) as any;
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
}
