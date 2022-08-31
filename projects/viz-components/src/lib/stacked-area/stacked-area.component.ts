import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
import { XyContent } from '../xy-chart/xy-content';
import { StackedAreaConfig } from './stacked-area.config';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-stacked-area]',
  templateUrl: './stacked-area.component.html',
  styleUrls: ['./stacked-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DATA_MARKS, useExisting: StackedAreaComponent }],
})
export class StackedAreaComponent
  extends XyContent
  implements XyDataMarks, OnChanges, OnInit
{
  @Input() config: StackedAreaConfig;
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
    if (this.utilities.objectChangedNotFirstTime(changes, 'config')) {
      this.setMethodsFromConfigAndDraw();
    }
  }

  ngOnInit(): void {
    this.subscribeToRanges();
    this.subscribeToScales();
    this.setMethodsFromConfigAndDraw();
  }

  setMethodsFromConfigAndDraw(): void {
    this.setValueArrays();
    this.initXAndCategoryDomains();
    this.setValueIndicies();
    this.setSeries();
    this.initYDomain();
    this.setScaledSpaceProperties();
    this.initCategoryScale();
    this.setArea();
    this.drawMarks(this.chart.transitionDuration);
  }

  resizeMarks(): void {
    if (this.values.x && this.values.y) {
      this.setScaledSpaceProperties();
      this.setArea();
      this.drawMarks(0);
    }
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

  setScaledSpaceProperties(): void {
    this.zone.run(() => {
      this.chart.updateXScale(
        this.config.x.scaleType(this.config.x.domain, this.ranges.x)
      );
      this.chart.updateYScale(
        this.config.y.scaleType(this.config.y.domain, this.ranges.y)
      );
    });
  }

  initCategoryScale(): void {
    if (this.config.category.colorScale === undefined) {
      this.config.category.colorScale = scaleOrdinal(
        new InternSet(this.config.category.domain),
        this.config.category.colors
      );
    }
    this.chart.updateCategoryScale(this.config.category.colorScale);
  }

  setArea(): void {
    this.area = area()
      .x(({ i }: any) => this.xScale(this.values.x[i]))
      .y0(([y1]) => this.yScale(y1))
      .y1(([, y2]) => this.yScale(y2))
      .curve(this.config.curve);
  }

  drawMarks(transitionDuration: number): void {
    this.drawAreas(transitionDuration);
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
              this.categoryScale(this.values.category[i])
            )
            .attr('d', this.area),
        (update) =>
          update.call((update) =>
            update
              .transition(t as any)
              .attr('d', this.area)
              .attr('fill', ([{ i }]) =>
                this.categoryScale(this.values.category[i])
              )
          ),
        (exit) => exit.remove()
      );
  }

  onPointerEnter: (event: PointerEvent) => void;
  onPointerLeave: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
}
