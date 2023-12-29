import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  area,
  extent,
  InternMap,
  InternSet,
  map,
  range,
  rollup,
  scaleOrdinal,
  select,
  SeriesPoint,
  stack,
  Transition,
} from 'd3';
import { UtilitiesService } from '../core/services/utilities.service';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { XyDataMarks, XyDataMarksValues } from '../data-marks/xy-data-marks';
import { XyDataMarksContent } from '../xy-chart/xy-data-marks-content';
import { VicStackedAreaConfig } from './stacked-area.config';

export const STACKED_AREA = new InjectionToken<StackedAreaComponent>(
  'StackedAreaComponent'
);

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-stacked-area]',
  templateUrl: './stacked-area.component.html',
  styleUrls: ['./stacked-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DATA_MARKS, useExisting: StackedAreaComponent },
    { provide: STACKED_AREA, useExisting: StackedAreaComponent },
  ],
})
export class StackedAreaComponent
  extends XyDataMarksContent
  implements XyDataMarks, OnChanges, OnInit
{
  @Input() config: VicStackedAreaConfig;
  values: XyDataMarksValues = new XyDataMarksValues();
  series: (SeriesPoint<InternMap<any, number>> & { i: number })[][];
  area;
  areas;

  constructor(
    private areasRef: ElementRef<SVGSVGElement>,
    private utilities: UtilitiesService,
    private zone: NgZone
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.utilities.objectOnNgChangesChangedNotFirstTime(changes, 'config')
    ) {
      this.setPropertiesFromConfig();
    }
  }

  setPropertiesFromConfig(): void {
    this.setValueArrays();
    this.initXAndCategoryDomains();
    this.setValueIndicies();
    this.setSeries();
    this.initYDomain();
    this.initCategoryScale();
    this.setChartScales(true);
  }

  setValueArrays(): void {
    this.values.x = map(this.config.data, this.config.x.valueAccessor);
    this.values.y = map(this.config.data, this.config.y.valueAccessor);
    this.values.category = map(
      this.config.data,
      this.config.category.valueAccessor
    );
  }

  initXAndCategoryDomains(): void {
    if (this.config.x.domain === undefined) {
      this.config.x.domain = extent(this.values.x);
    }
    if (this.config.category.domain === undefined) {
      this.config.category.domain = this.values.category;
    }
    this.config.category.domain = new InternSet(this.config.category.domain);
  }

  setValueIndicies(): void {
    this.values.indicies = range(this.values.x.length).filter((i) =>
      (this.config.category.domain as InternSet).has(this.values.category[i])
    );
  }

  setSeries(): void {
    const rolledUpData: InternMap<any, InternMap<any, number>> = rollup(
      this.values.indicies,
      ([i]) => i,
      (i) => this.values.x[i],
      (i) => this.values.category[i]
    );

    const keys = this.config.categoryOrder
      ? this.config.categoryOrder.slice().reverse()
      : this.config.category.domain;

    this.series = stack<any, InternMap<any, number>, any>()
      .keys(keys)
      .value(([x, I]: any, category) => this.values.y[I.get(category)])
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

  initYDomain(): void {
    if (this.config.y.domain === undefined) {
      this.config.y.domain = extent(this.series.flat(2));
      this.config.y.domain[0] = Math.floor(this.config.y.domain[0]);
      this.config.y.domain[1] = Math.ceil(this.config.y.domain[1]);
    }
  }

  initCategoryScale(): void {
    if (this.config.category.colorScale === undefined) {
      this.config.category.colorScale = scaleOrdinal(
        new InternSet(this.config.category.domain),
        this.config.category.colors
      );
    }
  }

  setChartScales(useTransition: boolean): void {
    this.zone.run(() => {
      const x = this.config.x.scaleType(this.config.x.domain, this.ranges.x);
      const y = this.config.y.scaleType(this.config.y.domain, this.ranges.y);
      const category = this.config.category.colorScale;
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
      .x(({ i }: any) => this.scales.x(this.values.x[i]))
      .y0(([y1]) => this.scales.y(y1))
      .y1(([, y2]) => this.scales.y(y2))
      .curve(this.config.curve);
  }

  drawAreas(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.areas = select(this.areasRef.nativeElement)
      .selectAll('path')
      .data(this.series)
      .join(
        (enter) =>
          enter
            .append('path')
            .property('key', ([{ i }]) => this.values.category[i])
            .attr('fill', ([{ i }]) =>
              this.scales.category(this.values.category[i])
            )
            .attr('d', this.area),
        (update) =>
          update.call((update) =>
            update
              .transition(t as any)
              .attr('d', this.area)
              .attr('fill', ([{ i }]) =>
                this.scales.category(this.values.category[i])
              )
          ),
        (exit) => exit.remove()
      );
  }
}
