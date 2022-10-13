import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
  startWith,
  throttleTime,
} from 'rxjs';
import { DataMarks } from '../data-marks/data-marks';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { Chart } from './chart';
import { CHART } from './chart.token';

export interface Ranges {
  x: [number, number];
  y: [number, number];
}

export interface ElementSpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Dimensions {
  width: number;
  height: number;
}
@Component({
  selector: 'vic-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CHART, useExisting: ChartComponent }],
})
export class ChartComponent
  implements Chart, OnInit, OnChanges, AfterContentInit
{
  @ContentChild(DATA_MARKS)
  dataMarksComponent: DataMarks;
  @ViewChild('div', { static: true }) divRef: ElementRef<HTMLDivElement>;
  @ViewChild('svg', { static: true }) svgRef: ElementRef<SVGSVGElement>;
  @Input() width = 800;
  @Input() height = 600;
  @Input() margin: ElementSpacing = {
    top: 36,
    right: 36,
    bottom: 36,
    left: 36,
  };
  @Input() scaleChartWithContainer = true;
  @Input() transitionDuration?: number = 250;
  aspectRatio: number;
  svgDimensions$: Observable<Dimensions>;
  ranges$: Observable<Ranges>;
  inputHeight: BehaviorSubject<number> = new BehaviorSubject(this.height);
  inputHeight$ = this.inputHeight.asObservable();
  inputWidth: BehaviorSubject<number> = new BehaviorSubject(this.width);
  inputWidth$ = this.inputWidth.asObservable();
  resizeThrottleTime = 100;

  constructor(private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['height']) {
      this.setAspectRatio();
      this.inputHeight.next(this.height);
    }
    if (changes['width']) {
      this.setAspectRatio();
      this.inputWidth.next(this.width);
    }
  }

  ngOnInit(): void {
    this.setAspectRatio();
    this.createDimensionObservables();
  }

  ngAfterContentInit(): void {
    if (!this.dataMarksComponent) {
      throw new Error('DataMarksComponent not found.');
    }
  }

  setAspectRatio(): void {
    this.aspectRatio = this.width / this.height;
  }

  createDimensionObservables() {
    let divWidth$: Observable<number>;

    if (this.scaleChartWithContainer) {
      divWidth$ = combineLatest([
        this.getResizedDivWidthObservable(),
        this.inputWidth$,
      ]).pipe(
        map(([resizeWidth, inputWidth]) => {
          return resizeWidth > inputWidth ? inputWidth : resizeWidth;
        })
      );
    } else {
      divWidth$ = this.inputWidth$;
    }

    this.svgDimensions$ = combineLatest([divWidth$, this.inputHeight$]).pipe(
      map(([divWidth, height]) => this.getSvgDimensionsFromDivWidth(divWidth))
    );

    this.ranges$ = this.svgDimensions$.pipe(
      map((dimensions) => this.getRangesFromSvgDimensions(dimensions)),
      shareReplay()
    );
  }

  getResizedDivWidthObservable(): Observable<number> {
    return this.getResizedDivDimensionsObservable().pipe(
      map((dimensions) => dimensions.width),
      startWith(this.divRef.nativeElement.offsetWidth),
      throttleTime(this.resizeThrottleTime),
      distinctUntilChanged()
    );
  }

  getResizedDivDimensionsObservable(): Observable<Dimensions> {
    const el = this.divRef.nativeElement;
    return new Observable((subscriber) => {
      const observer = new ResizeObserver((entries) => {
        subscriber.next({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height,
        });
      });
      observer.observe(el);
      return function unsubscribe() {
        observer.unobserve(el);
        observer.disconnect();
      };
    });
  }

  getSvgDimensionsFromDivWidth(divWidth: any) {
    const width = this.getSvgWidthFromDivWidth(divWidth);
    const height = this.getSvgHeightFromWidth(width);
    return { width, height };
  }

  getSvgWidthFromDivWidth(divWidth: number): any {
    return !this.scaleChartWithContainer ? this.width : divWidth;
  }

  getSvgHeightFromWidth(width: number): number {
    return !this.chartShouldScale() ? this.height : width / this.aspectRatio;
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
    return { x: xRange, y: yRange };
  }

  chartShouldScale(): boolean {
    return (
      this.scaleChartWithContainer &&
      this.divRef.nativeElement.offsetWidth <= this.width
    );
  }
}
