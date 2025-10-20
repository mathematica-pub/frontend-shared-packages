import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  Input,
  NgZone,
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
  auditTime,
  combineLatest,
  defer,
  distinctUntilChanged,
  filter,
  map,
  of,
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

  private _config: BehaviorSubject<ChartConfig> = new BehaviorSubject(null);
  config$: Observable<ChartConfig> = this._config.asObservable().pipe(
    filter((c) => !!c),
    distinctUntilChanged((a, b) => isEqual(a, b)),
    shareReplay(1)
  );

  protected readonly strategy$ = this.config$.pipe(
    map((c) => c.scalingStrategy),
    distinctUntilChanged()
  );

  protected readonly widthCfg$ = this.config$.pipe(
    map((c) => c.width),
    distinctUntilChanged()
  );

  protected readonly minWidthCfg$ = this.config$.pipe(
    map((c) => c.minWidth),
    distinctUntilChanged()
  );

  protected readonly heightCfg$ = this.config$.pipe(
    map((c) => c.height),
    distinctUntilChanged()
  );

  private readonly aspectRatioCfg$ = this.config$.pipe(
    map(
      (c) =>
        c.aspectRatio ??
        (typeof c.width === 'number' &&
        typeof c.height === 'number' &&
        c.height !== 0
          ? c.width / c.height
          : undefined)
    ),
    distinctUntilChanged()
  );

  private readonly isFixedHeight$ = this.config$.pipe(
    map((c) => c.isFixedHeight),
    distinctUntilChanged()
  );

  protected readonly marginCfg$ = this.config$.pipe(
    map((c) => c.margin),
    distinctUntilChanged((a, b) => isEqual(a, b))
  );

  private readonly width$ = this.strategy$.pipe(
    switchMap((strategy) =>
      strategy === 'responsive-width'
        ? defer(() => this.observeElementWidth(this.divRef.nativeElement))
        : strategy === 'viewbox'
          ? of(this.config.viewBoxX)
          : this.widthCfg$
    )
  );

  private readonly height$ = combineLatest([
    this.strategy$,
    this.width$,
    this.heightCfg$,
    this.aspectRatioCfg$,
    this.isFixedHeight$,
  ]).pipe(
    map(([strategy, w, hCfg, ar, isFixedHeight]) =>
      strategy === 'responsive-width' && !isFixedHeight
        ? w / ar
        : strategy === 'viewbox'
          ? this.config.viewBoxY
          : hCfg
    ),
    distinctUntilChanged()
  );

  protected readonly svgDimensions$ = combineLatest([
    this.width$,
    this.height$,
  ]).pipe(
    filter(([w, h]) => w > 0 && h > 0),
    map(([width, height]) => ({ width, height })),
    distinctUntilChanged((a, b) => isEqual(a, b)),
    shareReplay(1)
  );

  readonly ranges$ = combineLatest([this.svgDimensions$, this.marginCfg$]).pipe(
    map(([dimensions, margin]) =>
      this.getRangesFromSvgDimensions(dimensions, margin)
    ),
    distinctUntilChanged((a, b) => isEqual(a, b)),
    shareReplay(1)
  );

  protected destroyRef = inject(DestroyRef);

  constructor(private ngZone: NgZone) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (NgOnChangesUtilities.inputObjectChanged(changes, 'config')) {
      this._config.next(this.config);
    }
  }

  ngOnInit(): void {
    // ensure that values are pulled through
    this.ranges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private observeElementWidth(element: HTMLElement): Observable<number> {
    return new Observable<number>((subscriber) => {
      let ro: ResizeObserver;
      this.ngZone.runOutsideAngular(() => {
        ro = new ResizeObserver((entries) => {
          const e = entries[0];
          const w =
            (Array.isArray(e.borderBoxSize)
              ? e.borderBoxSize[0]?.inlineSize
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (e as any).borderBoxSize?.inlineSize) ?? e.contentRect.width;
          this.ngZone.run(() => subscriber.next(w));
        });
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ro.observe(element, { box: 'border-box' as any });
      return () => {
        ro.unobserve(element);
        ro.disconnect();
      };
    }).pipe(
      map((w) => Math.round(w)),
      auditTime(0),
      distinctUntilChanged()
    );
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

  getViewBoxScale(): { x: number; y: number } {
    if (!this.svgRef?.nativeElement?.viewBox?.baseVal) {
      return { x: 1, y: 1 };
    }
    const rect = this.svgRef.nativeElement.getBoundingClientRect();
    const vb = this.svgRef.nativeElement.viewBox.baseVal;
    return {
      x: vb.width / rect.width,
      y: vb.height / rect.height,
    };
  }
}
