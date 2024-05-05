import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  NgZone,
} from '@angular/core';
import {
  InternMap,
  SeriesPoint,
  Transition,
  area,
  extent,
  range,
  rollup,
  select,
  stack,
} from 'd3';
import { VIC_DATA_MARKS } from '../data-marks/data-marks.token';
import { VicDataValue } from '../data-marks/dimensions/data-dimension';
import { VicXyDataMarks } from '../xy-data-marks/xy-data-marks';
import { VicStackedAreaConfig } from './stacked-area.config';

// Ideally we would be able to use generic T with the component, but Angular doesn't yet support this, so we use unknown instead
// https://github.com/angular/angular/issues/46815, https://github.com/angular/angular/pull/47461
export const STACKED_AREA = new InjectionToken<
  StackedAreaComponent<unknown, VicDataValue>
>('StackedAreaComponent');

type Key = string | number | Date;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-stacked-area]',
  templateUrl: './stacked-area.component.html',
  styleUrls: ['./stacked-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_DATA_MARKS, useExisting: StackedAreaComponent },
    { provide: STACKED_AREA, useExisting: StackedAreaComponent },
  ],
})
export class StackedAreaComponent<
  Datum,
  TCategoricalValue extends VicDataValue
> extends VicXyDataMarks<
  Datum,
  VicStackedAreaConfig<Datum, TCategoricalValue>
> {
  series: (SeriesPoint<InternMap<Key, number>> & {
    i: number;
  })[][];
  area;
  areas;

  constructor(
    private areasRef: ElementRef<SVGSVGElement>,
    private zone: NgZone
  ) {
    super();
  }

  setPropertiesFromData(): void {
    this.setDimensionPropertiesFromData();
    this.setValueIndicies();
    this.setSeries();
    this.initQuantitativeDomainFromStack();
  }

  setDimensionPropertiesFromData(): void {
    this.config.x.setPropertiesFromData(this.config.data);
    this.config.y.setPropertiesFromData(this.config.data);
    this.config.categorical.setPropertiesFromData(this.config.data);
  }

  setValueIndicies(): void {
    this.valueIndicies = range(this.config.x.values.length).filter((i) =>
      this.config.categorical.domainIncludes(this.config.categorical.values[i])
    );
  }

  setSeries(): void {
    const rolledUpData: InternMap<Key, InternMap<Key, number>> = rollup(
      this.valueIndicies,
      ([i]) => i,
      (i) => this.config.x.values[i],
      (i) => this.config.categorical.values[i]
    );

    const keys = this.config.categoricalOrder
      ? this.config.categoricalOrder.slice().reverse()
      : this.config.categorical.domain;

    this.series = stack<any, InternMap<any, number>, any>()
      .keys(keys)
      .value(([x, I]: any, category) => this.config.y.values[I.get(category)])
      .order(this.config.stackOrderFunction)
      .offset(this.config.stackOffsetFunction)(rolledUpData as any)
      .map((s) =>
        s.map((d) =>
          Object.assign(d, {
            i: d.data[1].get(s.key),
          })
        )
      );
  }

  initQuantitativeDomainFromStack(): void {
    if (this.config.y.domain === undefined) {
      this.config.y.setUnpaddedDomain(extent(this.series.flat(2)));
    }
  }

  setPropertiesFromRanges(useTransition: boolean): void {
    const x = this.config.x.getScaleFromRange(this.ranges.x);
    const y = this.config.y.getScaleFromRange(this.ranges.y);
    const category = this.config.categorical.scale;
    this.zone.run(() => {
      this.chart.updateScales({ x, y, category, useTransition });
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
      .data(this.series)
      .join(
        (enter) =>
          enter
            .append('path')
            .property('key', ([{ i }]) => this.config.categorical.values[i])
            .attr('fill', ([{ i }]) =>
              this.scales.category(this.config.categorical.values[i])
            )
            .attr('d', this.area),
        (update) =>
          update.call((update) =>
            update
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .transition(t as any)
              .attr('d', this.area)
              .attr('fill', ([{ i }]) =>
                this.scales.category(this.config.categorical.values[i])
              )
          ),
        (exit) => exit.remove()
      );
  }
}
