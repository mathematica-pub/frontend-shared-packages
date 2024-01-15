import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {
  InternMap,
  InternSet,
  Stack,
  Transition,
  extent,
  range,
  rollup,
  select,
  stack,
} from 'd3';
import { BarsComponent } from '../bars/bars.component';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { VicStackDatum, VicStackedBarsConfig } from './stacked-bars.config';

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
  stackedData: Stack<any, { [key: string]: number }, string>;

  override setPropertiesFromConfig(): void {
    this.setValueArrays();
    this.initNonQuantitativeDomains();
    this.setValueIndicies();
    this.setHasBarsWithNegativeValues();
    this.initUnpaddedQuantitativeDomain();
    this.initCategoryScale();
    this.constructStackedData();
    this.setChartScalesFromRanges(true);
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

  override initUnpaddedQuantitativeDomain(): void {
    // no unit test
    if (this.config.quantitative.domain === undefined) {
      this.config.quantitative.domain = extent(this.stackedData.flat(2));
    }
  }

  constructStackedData(): void {
    // no unit test
    this.stackedData = stack()
      .keys(this.config.category.domain as InternSet)
      .value(
        ([, I], z) => this.values[this.config.dimensions.quantitative][I.get(z)]
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

  override drawBars(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.barGroups = select(this.barsRef.nativeElement)
      .selectAll<SVGGElement, number>('g')
      .data(this.stackedData)
      .join('g')
      .attr('fill', ([{ i }]: any) =>
        this.scales.category(this.values.category[i])
      )
      .selectAll('rect')
      .data((d) => d as any)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('x', (i) => this.getStackElementX(i as VicStackDatum))
            .attr('y', (i) => this.getStackElementY(i as VicStackDatum))
            .attr('width', (i) => this.getStackElementWidth(i as VicStackDatum))
            .attr('height', (i) =>
              this.getStackElementHeight(i as VicStackDatum)
            ),
        (update) =>
          update.call((update) =>
            update
              .transition(t as any)
              .attr('x', (i) => this.getStackElementX(i as VicStackDatum))
              .attr('y', (i) => this.getStackElementY(i as VicStackDatum))
              .attr('width', (i) =>
                this.getStackElementWidth(i as VicStackDatum)
              )
              .attr('height', (i) =>
                this.getStackElementHeight(i as VicStackDatum)
              )
          ),
        (exit) =>
          exit // fancy exit needs to be tested with actual/any data
            .transition(t as any)
            .delay((_, i) => i * 20)
            .attr('y', this.scales.y(0))
            .attr('height', 0)
            .remove()
      );
  }

  getStackElementX(datum: VicStackDatum): number {
    // no unit test
    if (this.config.dimensions.ordinal === 'x') {
      return this.scales.x(this.values.x[datum.i]);
    } else {
      return Math.min(this.scales.x(datum[0]), this.scales.x(datum[1]));
    }
  }

  getStackElementY(datum: VicStackDatum): number {
    // no unit test
    if (this.config.dimensions.ordinal === 'x') {
      return Math.min(this.scales.y(datum[0]), this.scales.y(datum[1]));
    } else {
      return this.scales.y(this.values.y[datum.i]);
    }
  }

  getStackElementWidth(datum: VicStackDatum): number {
    // no unit test
    if (this.config.dimensions.ordinal === 'x') {
      return (this.scales.x as any).bandwidth();
    } else {
      return Math.abs(this.scales.x(datum[0]) - this.scales.x(datum[1]));
    }
  }

  getStackElementHeight(datum: VicStackDatum): number {
    // no unit test
    if (this.config.dimensions.ordinal === 'x') {
      return Math.abs(this.scales.y(datum[0]) - this.scales.y(datum[1]));
    } else {
      return (this.scales.y as any).bandwidth();
    }
  }
}
