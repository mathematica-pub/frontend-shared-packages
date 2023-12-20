import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {
  extent,
  InternMap,
  InternSet,
  range,
  rollup,
  select,
  stack,
  Transition,
} from 'd3';
import { BarsComponent } from '../bars/bars.component';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { StackDatum, StackedBarsConfig } from './stacked-bars.config';

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
  @Input() override config: StackedBarsConfig;
  stackedData: any;

  override setMethodsFromConfigAndDraw(): void {
    this.setValueArrays();
    this.initNonQuantitativeDomains();
    this.setValueIndicies();
    this.setHasBarsWithNegativeValues();
    this.constructStackedData();
    this.initUnpaddedQuantitativeDomain();
    this.initCategoryScale();
    this.setScaledSpaceProperties();
    this.drawMarks(this.chart.transitionDuration);
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
    // no unit test
    this.stackedData = stack()
      .keys(this.config.category.domain as InternSet)
      .value(
        ([x, I]: any, z) =>
          this.values[this.config.dimensions.quantitative][I.get(z)]
      )
      .order(this.config.order)
      .offset(this.config.offset)(
        rollup(
          this.values.indicies,
          ([i]) => i,
          (i) => this.values[this.config.dimensions.ordinal][i],
          (i) => this.values.category[i]
        ) as any
      )
      .map((s) =>
        s.map((d) =>
          Object.assign(d, {
            i: (d.data[1] as unknown as InternMap<string, number>).get(s.key),
          })
        )
      );
  }

  override initUnpaddedQuantitativeDomain(): void {
    // no unit test
    if (this.config.quantitative.domain === undefined) {
      this.config.quantitative.domain = extent(this.stackedData.flat(2));
    }
  }

  override drawBars(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.barGroups = select(this.barsRef.nativeElement)
      .selectAll('g')
      .data(this.stackedData)
      .join('g')
      .attr('fill', ([{ i }]: any) => {
        return this.config.category.colorScale(this.values.category[i]);
      })
      .selectAll('rect')
      .data((d) => d as any)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('x', (i) => this.getStackElementX(i as StackDatum))
            .attr('y', (i) => this.getStackElementY(i as StackDatum))
            .attr('width', (i) => this.getStackElementWidth(i as StackDatum))
            .attr('height', (i) => this.getStackElementHeight(i as StackDatum)),
        (update) =>
          update.call((update) =>
            update
              .transition(t as any)
              .attr('x', (i) => this.getStackElementX(i as StackDatum))
              .attr('y', (i) => this.getStackElementY(i as StackDatum))
              .attr('width', (i) => this.getStackElementWidth(i as StackDatum))
              .attr('height', (i) =>
                this.getStackElementHeight(i as StackDatum)
              )
          ),
        (exit) =>
          exit // fancy exit needs to be tested with actual/any data
            .transition(t as any)
            .delay((_, i) => i * 20)
            .attr('y', this.yScale(0))
            .attr('height', 0)
            .remove()
      );
  }

  getStackElementX(datum: StackDatum): number {
    // no unit test
    if (this.config.dimensions.ordinal === 'x') {
      return this.xScale(this.values.x[datum.i]);
    } else {
      return Math.min(this.xScale(datum[0]), this.xScale(datum[1]));
    }
  }

  getStackElementY(datum: StackDatum): number {
    // no unit test
    if (this.config.dimensions.ordinal === 'x') {
      return Math.min(this.yScale(datum[0]), this.yScale(datum[1]));
    } else {
      return this.yScale(this.values.y[datum.i]);
    }
  }

  getStackElementWidth(datum: StackDatum): number {
    // no unit test
    if (this.config.dimensions.ordinal === 'x') {
      return (this.xScale as any).bandwidth();
    } else {
      return Math.abs(this.xScale(datum[0]) - this.xScale(datum[1]));
    }
  }

  getStackElementHeight(datum: StackDatum): number {
    // no unit test
    if (this.config.dimensions.ordinal === 'x') {
      return Math.abs(this.yScale(datum[0]) - this.yScale(datum[1]));
    } else {
      return (this.yScale as any).bandwidth();
    }
  }
}
