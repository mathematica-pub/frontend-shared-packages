import {
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgOnChangesUtilities } from '@hsi/app-dev-kit';
import { min } from 'd3';
import { isEqual } from 'lodash-es';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  merge,
  of,
  shareReplay,
  startWith,
} from 'rxjs';
import { Dimensions, ElementSpacing } from '../../core/types/layout';
import { Chart } from './chart';
import { CHART } from './chart.token';
import { VicChartConfigBuilder } from './config/chart-builder';
import { ChartConfig } from './config/chart-config';
import { ElementWidthObserver } from './element-width-observer';

export interface Ranges {
  x: [number, number];
  y: [number, number];
}

export interface ChartScaling {
  width: boolean;
  height: boolean;
}

/**
 * A base component that can be extended to create specific types of `Chart` components,
 *  each of which can serve as a wrapper component for one `PrimaryMarks` component and any
 *  other content that is projected into its content projection slots.
 *
 * <p class="comment-slots">Content projection slots</p>
 *
 * `html-elements-before`: Elements that will be projected before the chart's scaled div
 *  and scaled svg element in the DOM. USeful for adding elements that require access to chart scales.
 *
 * `svg-defs`: Used to create any required defs for the chart's svg element. For example, patterns or gradients.
 *
 * `svg-elements`: Used for all elements that should be children of the chart's scaled svg element.
 *
 * `html-elements-after`: Elements that will be projected after the chart's scaled div
 *  and scaled svg element in the DOM. USeful for adding elements that require access to chart scales.
 */
@Component({
  selector: 'vic-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  providers: [
    { provide: CHART, useExisting: ChartComponent },
    ElementWidthObserver,
  ],
  host: {
    class: 'vic-chart',
  },
})
export class ChartComponent implements Chart, OnInit, OnChanges {
  @Input() config: ChartConfig = new VicChartConfigBuilder().getConfig();
  @ViewChild('div', { static: true }) divRef: ElementRef<HTMLDivElement>;
  @ViewChild('svg', { static: true }) svgRef: ElementRef<SVGSVGElement>;
  private _height: BehaviorSubject<number> = new BehaviorSubject(null);
  height$ = this._height.asObservable();
  private _margin: BehaviorSubject<ElementSpacing> = new BehaviorSubject(null);
  margin$ = this._margin.asObservable();
  ranges$: Observable<Ranges>;
  svgDimensions$: Observable<Dimensions>;
  protected destroyRef = inject(DestroyRef);
  private widthObserver = inject(ElementWidthObserver);

  ngOnChanges(changes: SimpleChanges): void {
    if (
      NgOnChangesUtilities.inputObjectChangedNotFirstTime(changes, 'config')
    ) {
      this.initFromConfig();
    }
  }

  ngOnInit(): void {
    this.initFromConfig();
  }

  initFromConfig(): void {
    this._height.next(this.config.height);
    this._margin.next(this.config.margin);
    this.createDimensionObservables();
  }

  createDimensionObservables() {
    const divWidth$ = this.getDivWidthObservable();
    const height$ = this.height$.pipe(startWith(this.config.height));
    const margin$ = this.margin$.pipe(
      startWith(this.config.margin),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );

    this.svgDimensions$ = combineLatest([divWidth$, height$]).pipe(
      filter(([divWidth, height]) => divWidth > 0 && height > 0),
      map(([divWidth]) => this.getSvgDimensionsFromDivWidth(divWidth)),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );

    this.ranges$ = combineLatest([this.svgDimensions$, margin$]).pipe(
      map(([dimensions]) => this.getRangesFromSvgDimensions(dimensions)),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );
  }

  private getDivWidthObservable(): Observable<number> {
    if (!this.config.scaleChartWithContainerWidth.width) {
      return of(this.config.width);
    }

    const initialWidth$ = of(
      min([this.divRef.nativeElement.offsetWidth, this.config.width])
    );

    const resize$ = this.widthObserver.observe(this.divRef.nativeElement);
    // ensure that there is always a subscription to divWidthResize$ so that it emits
    resize$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    return merge(initialWidth$, resize$).pipe(distinctUntilChanged());
  }

  getSvgDimensionsFromDivWidth(divWidth: number) {
    const width = this.getSvgWidthFromDivWidth(divWidth);
    const height = this.getSvgHeightFromWidth(width);
    return { width, height };
  }

  getSvgWidthFromDivWidth(divWidth: number): number {
    return !this.config.scaleChartWithContainerWidth.width
      ? this.config.width
      : divWidth;
  }

  getSvgHeightFromWidth(width: number): number {
    return this.config.scaleChartWithContainerWidth.height &&
      this.divRef.nativeElement.offsetWidth <= this.config.width
      ? width / this.config.aspectRatio
      : this.config.height;
  }

  getRangesFromSvgDimensions(dimensions: Dimensions): Ranges {
    const xRange: [number, number] = [
      this.config.margin.left,
      dimensions.width - this.config.margin.right,
    ];
    const yRange: [number, number] = [
      dimensions.height - this.config.margin.bottom,
      this.config.margin.top,
    ];
    return { x: xRange, y: yRange };
  }
}
