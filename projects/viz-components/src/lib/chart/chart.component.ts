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
import { Dimensions, ElementSpacing } from '../core/types/layout';
import { Chart } from './chart';
import { CHART } from './chart.token';

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
 *  each of which can serve as a wrapper component for one `DataMarks` component and any
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
  providers: [{ provide: CHART, useExisting: ChartComponent }],
})
export class ChartComponent implements Chart, OnInit, OnChanges {
  @ViewChild('div', { static: true }) divRef: ElementRef<HTMLDivElement>;
  @ViewChild('svg', { static: true }) svgRef: ElementRef<SVGSVGElement>;
  /**
   * If chart size is dynamic, the maximum height of the chart.
   *
   * In that case, this value is used to determine the aspect ratio of the chart which will be maintained on resizing
   *
   * If chart size is static, the fixed height of the chart.
   */
  @Input() height = 600;
  /**
   * The margin that will be established between the edges of the svg and the svg's contents.
   */
  @Input() margin: ElementSpacing = {
    top: 36,
    right: 36,
    bottom: 36,
    left: 36,
  };

  /**
   * Determines whether the chart size is fixed or will scale with its container.
   *
   * Width and height properties can be set separately. If both are true, the aspect ratio determined by width and height values will be maintained.
   */
  @Input() scaleChartWithContainerWidth: ChartScaling = {
    width: true,
    height: true,
  };
  /**
   * A time duration for all transitions in the chart, in ms.
   */
  @Input() transitionDuration = 250;
  /**
   * If chart size is dynamic, the maximum width of the chart.
   *
   * In that case, this value is also used to determine the aspect ratio of the chart which will be maintained on resizing
   *
   * If chart size is static, the fixed width of the chart.
   */
  @Input() width = 800;
  aspectRatio: number;
  private _height: BehaviorSubject<number> = new BehaviorSubject(this.height);
  height$ = this._height.asObservable();
  private _margin: BehaviorSubject<ElementSpacing> = new BehaviorSubject(
    this.margin
  );
  margin$ = this._margin.asObservable();
  ranges$: Observable<Ranges>;
  svgDimensions$: Observable<Dimensions>;
  protected destroyRef = inject(DestroyRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['height']) {
      this.setAspectRatio();
      this._height.next(this.height);
    }
    if (changes['width']) {
      this.setAspectRatio();
    }
    if (changes['margin']) {
      this._margin.next(this.margin);
    }
  }

  ngOnInit(): void {
    this.setAspectRatio();
    this.createDimensionObservables();
  }

  setAspectRatio(): void {
    this.aspectRatio = this.width / this.height;
  }

  createDimensionObservables() {
    let divWidth$: Observable<number>;

    if (this.scaleChartWithContainerWidth.width) {
      const width$ = of(
        min([this.divRef.nativeElement.offsetWidth, this.width])
      );
      const divWidthResize$ = this.getDivWidthResizeObservable();
      divWidth$ = merge(width$, divWidthResize$).pipe(distinctUntilChanged());
      divWidthResize$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    } else {
      divWidth$ = of(this.width);
    }

    const height$ = this.height$.pipe(startWith(this.height));

    this.svgDimensions$ = combineLatest([divWidth$, height$]).pipe(
      map(([divWidth]) => this.getSvgDimensionsFromDivWidth(divWidth)),
      shareReplay(1)
    );

    const margin$ = this.margin$.pipe(
      startWith(this.margin),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );

    this.ranges$ = combineLatest([this.svgDimensions$, margin$]).pipe(
      map(([dimensions]) => this.getRangesFromSvgDimensions(dimensions)),
      filter(
        (ranges) =>
          Object.values(ranges).every((range) => range[0] >= 0 && range[1] >= 0) // covers case when div width is 0 and range becomes negative due to margins -- happens when removing chart from DOM w/ lazy loading
      ),
      shareReplay(1)
    );
  }

  getDivWidthResizeObservable(): Observable<number> {
    const el = this.divRef.nativeElement;
    return new Observable((subscriber) => {
      const observer = new ResizeObserver((entries) => {
        subscriber.next(entries[0].contentRect.width);
      });
      observer.observe(el);
      return () => {
        observer.unobserve(el);
        observer.disconnect();
      };
    });
  }

  getSvgDimensionsFromDivWidth(divWidth: number) {
    const width = this.getSvgWidthFromDivWidth(divWidth);
    const height = this.getSvgHeightFromWidth(width);
    console.log('svgDimensions', { width, height });
    return { width, height };
  }

  getSvgWidthFromDivWidth(divWidth: number): number {
    return !this.scaleChartWithContainerWidth.width ? this.width : divWidth;
  }

  getSvgHeightFromWidth(width: number): number {
    return this.scaleChartWithContainerWidth.height &&
      this.divRef.nativeElement.offsetWidth <= this.width
      ? width / this.aspectRatio
      : this.height;
  }

  getRangesFromSvgDimensions(dimensions: Dimensions): Ranges {
    const xRange: [number, number] = [
      this.margin.left,
      dimensions.width - this.margin.right,
    ];
    const yRange: [number, number] = [
      dimensions.height - this.margin.bottom,
      this.margin.top,
    ];
    console.log('ranges', { xRange, yRange });
    return { x: xRange, y: yRange };
  }
}
