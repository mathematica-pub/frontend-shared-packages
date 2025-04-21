import { CommonModule } from '@angular/common';
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
import { GenericScale } from '../../core';
import { Dimensions, ElementSpacing } from '../../core/types/layout';
import { Chart } from './chart';
import { CHART } from './chart.token';
import { VicChartConfigBuilder } from './config/chart-builder';
import { ChartConfig } from './config/chart-config';

export interface Ranges {
  x: [number, number];
  y: [number, number];
}

export interface ChartResizing {
  width: boolean;
  height: boolean;
  useViewbox: boolean;
}

export interface ChartScales {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  multiple: GenericScale<any, any>;
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
  providers: [{ provide: CHART, useExisting: ChartComponent }],
  host: {
    class: 'vic-chart',
  },
  imports: [CommonModule],
})
export class ChartComponent<Scales extends ChartScales = ChartScales>
  implements Chart, OnInit, OnChanges
{
  @Input() config: ChartConfig = new VicChartConfigBuilder().getConfig();
  @ViewChild('div', { static: true }) divRef: ElementRef<HTMLDivElement>;
  @ViewChild('svg', { static: true }) svgRef: ElementRef<SVGSVGElement>;
  protected scales: BehaviorSubject<Scales> = new BehaviorSubject<Scales>(null);
  scales$ = this.scales.asObservable().pipe(filter((scales) => !!scales));
  private _height: BehaviorSubject<number> = new BehaviorSubject(null);
  height$ = this._height.asObservable();
  private _margin: BehaviorSubject<ElementSpacing> = new BehaviorSubject(null);
  margin$ = this._margin.asObservable();
  ranges$: Observable<Ranges>;
  svgDimensions$: Observable<Dimensions>;
  protected destroyRef = inject(DestroyRef);

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
    if (!this.config.resize.width || this.config.resize.useViewbox) {
      return of(this.config.width);
    }

    const initialWidth$ = of(
      min([this.divRef.nativeElement.offsetWidth, this.config.width])
    );

    const resize$ = this.observeElementWidth(this.divRef.nativeElement);
    // ensure that there is always a subscription to divWidthResize$ so that it emits
    resize$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    return merge(initialWidth$, resize$).pipe(distinctUntilChanged());
  }

  private observeElementWidth(element: HTMLElement): Observable<number> {
    return new Observable((subscriber) => {
      const observer = new ResizeObserver((entries) => {
        subscriber.next(entries[0].contentRect.width);
      });
      observer.observe(element);
      return () => {
        observer.unobserve(element);
        observer.disconnect();
      };
    });
  }

  getSvgDimensionsFromDivWidth(divWidth: number) {
    const width = this.getSvgWidthFromDivWidth(divWidth);
    const height = this.getSvgHeightFromWidth(width);
    return { width, height };
  }

  getSvgWidthFromDivWidth(divWidth: number): number {
    return !this.config.resize.width ? this.config.width : divWidth;
  }

  getSvgHeightFromWidth(width: number): number {
    return this.config.resize.height &&
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
