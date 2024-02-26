import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {
  InternMap,
  InternSet,
  SeriesPoint,
  Transition,
  extent,
  max,
  min,
  range,
  rollup,
  select,
} from 'd3';
import { stack } from 'd3-shape';
import { BarsComponent } from '../bars/bars.component';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { VicStackedBarsConfig } from './stacked-bars.config';

export type VicStackDatum = SeriesPoint<{ [key: string]: number }> & {
  i: number;
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-stacked-bars]',
  templateUrl: '../bars/bars.component.html',
  styleUrls: ['./stacked-bars.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DATA_MARKS, useExisting: StackedBarsComponent }],
})
export class StackedBarsComponent<T> extends BarsComponent<T> {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('config') override userConfig: VicStackedBarsConfig<T>;
  override config: VicStackedBarsConfig<T>;
  stackedData: VicStackDatum[][];

  override setPropertiesFromConfig(): void {
    this.setValueArrays();
    this.initNonQuantitativeDomains();
    this.setValueIndicies();
    this.setHasBarsWithNegativeValues();
    this.constructStackedData();
    this.initUnpaddedQuantitativeDomain();
    this.initCategoryScale();
  }

  override setValueIndicies(): void {
    // no unit test
    this.values.indicies = range(
      this.values[this.config.dimensions.ordinal].length
    ).filter((i) => {
      return (
        (this.config.ordinal.domain as InternSet).has(
          this.values[this.config.dimensions.ordinal][i]
        ) &&
        (this.config.category.domain as InternSet).has(this.values.category[i])
      );
    });
  }

  constructStackedData(): void {
    const stackedData = stack<[unknown, InternMap<string, number>]>()
      .keys(this.config.category.domain)
      .value(
        (d, key) =>
          this.values[this.config.dimensions.quantitative][d[1].get(key)]
      )
      .order(this.config.order)
      .offset(this.config.offset)(
      rollup(
        this.values.indicies,
        ([i]) => i,
        (i) => this.values[this.config.dimensions.ordinal][i],
        (i) => this.values.category[i]
      )
    );

    this.stackedData = stackedData.map((series) =>
      series.map((d) => {
        Object.assign(d, {
          i: d.data[1].get(series.key),
        });
        return d as unknown as VicStackDatum;
      })
    );
  }

  override getDataMin(): number {
    const minStackValue = extent(this.stackedData.flat(2))[0];
    return min([minStackValue, 0]);
  }

  override getDataMax(): number {
    const maxStackValue = extent(this.stackedData.flat(2))[1];
    return max([maxStackValue, 0]);
  }

  override drawBars(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.barGroups = select(this.barsRef.nativeElement)
      .selectAll('g')
      .data(this.stackedData)
      .join('g')
      .attr('fill', ([{ i }]: any) =>
        this.scales.category(this.values.category[i])
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
              .transition(t as any)
              .attr('x', (d) => this.getStackElementX(d))
              .attr('y', (d) => this.getStackElementY(d))
              .attr('width', (d) => this.getStackElementWidth(d))
              .attr('height', (d) => this.getStackElementHeight(d))
          ),
        (exit) =>
          exit // fancy exit needs to be tested with actual/any data
            .transition(t as any)
            .delay((_, i) => i * 20)
            .attr('y', this.scales.y(0))
            .attr('height', 0)
            .remove()
      ) as any;
  }

  getStackElementX(datum: VicStackDatum): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.scales.x(this.values.x[datum.i]);
    } else {
      return Math.min(this.scales.x(datum[0]), this.scales.x(datum[1]));
    }
  }

  getStackElementY(datum: VicStackDatum): number {
    if (this.config.dimensions.ordinal === 'x') {
      return Math.min(this.scales.y(datum[0]), this.scales.y(datum[1]));
    } else {
      return this.scales.y(this.values.y[datum.i]);
    }
  }

  getStackElementWidth(datum: VicStackDatum): number {
    if (this.config.dimensions.ordinal === 'x') {
      return (this.scales.x as any).bandwidth();
    } else {
      return Math.abs(this.scales.x(datum[0]) - this.scales.x(datum[1]));
    }
  }

  getStackElementHeight(datum: VicStackDatum): number {
    if (this.config.dimensions.ordinal === 'x') {
      return Math.abs(this.scales.y(datum[0]) - this.scales.y(datum[1]));
    } else {
      return (this.scales.y as any).bandwidth();
    }
  }
}
