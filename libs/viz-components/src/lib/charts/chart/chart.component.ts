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
import { isEqual } from 'lodash-es';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
} from 'rxjs';
import { Dimensions, ElementSpacing } from '../../core/types/layout';
import { Chart } from './chart';
import { CHART } from './chart.token';
import { ScalingStrategy, VicChartConfigBuilder } from './config/chart-builder';
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

export interface ReactiveConfig {
  margin: ElementSpacing;
  height: number;
  width: number;
  scalingStrategy: ScalingStrategy;
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
export class ChartComponent implements Chart, OnInit, OnChanges {
  @Input() config: ChartConfig = new VicChartConfigBuilder().getConfig();
  @ViewChild('div', { static: true }) divRef: ElementRef<HTMLDivElement>;
  @ViewChild('svg', { static: true }) svgRef: ElementRef<SVGSVGElement>;
  svgDimensions$: Observable<Dimensions>;
  ranges$: Observable<Ranges>;
  private heightFromConfig = new BehaviorSubject<number>(null);
  protected heightFromConfig$ = this.heightFromConfig.asObservable();
  private marginFromConfig = new BehaviorSubject<ElementSpacing>(null);
  private marginFromConfig$ = this.marginFromConfig.asObservable();
  private scalingStrategy = new BehaviorSubject<ScalingStrategy | null>(null);
  protected scalingStrategy$ = this.scalingStrategy.asObservable();
  private widthFromConfig = new BehaviorSubject<number>(null);
  protected widthFromConfig$ = this.widthFromConfig.asObservable();
  protected destroyRef = inject(DestroyRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (
      NgOnChangesUtilities.inputObjectChangedNotFirstTime(changes, 'config')
    ) {
      this.updateFromConfig();
    }
  }

  ngOnInit(): void {
    this.updateUserDimensionProperties();
    this.createDimensionObservables();
  }

  private updateFromConfig(): void {
    this.updateUserDimensionProperties();
  }

  updateUserDimensionProperties(): void {
    this.heightFromConfig.next(this.config.height);
    this.marginFromConfig.next(this.config.margin);
    this.widthFromConfig.next(this.config.width);
    this.scalingStrategy.next(this.config.scalingStrategy);
  }

  createDimensionObservables() {
    const width$ = this.scalingStrategy$.pipe(
      switchMap((strategy) =>
        strategy === 'responsive-width'
          ? this.observeElementWidth(this.divRef.nativeElement)
          : this.widthFromConfig$
      )
    );

    const height$ = this.scalingStrategy$.pipe(
      switchMap((strategy) =>
        strategy === 'responsive-width' && !!this.config.aspectRatio
          ? width$.pipe(map((w) => w / this.config.aspectRatio))
          : this.heightFromConfig$
      )
    );

    this.svgDimensions$ = combineLatest([width$, height$]).pipe(
      filter(([w, h]) => w > 0 && h > 0),
      map(([width, height]) => ({ width, height })),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );

    this.ranges$ = combineLatest([
      this.svgDimensions$,
      this.marginFromConfig$,
    ]).pipe(
      map(([dimensions, margin]) =>
        this.getRangesFromSvgDimensions(dimensions, margin)
      ),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );

    // ensure that values are pulled through
    this.ranges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private observeElementWidth(element: HTMLElement): Observable<number> {
    return new Observable<number>((subscriber) => {
      const observer = new ResizeObserver((entries) => {
        subscriber.next(entries[0].contentRect.width);
      });
      observer.observe(element);
      return () => {
        observer.unobserve(element);
        observer.disconnect();
      };
    }).pipe(distinctUntilChanged());
  }

  private getRangesFromSvgDimensions(
    dim: Dimensions,
    margin: ElementSpacing
  ): Ranges {
    return {
      x: [margin.left, dim.width - margin.right],
      y: [dim.height - margin.bottom, margin.top],
    };
  }
}
