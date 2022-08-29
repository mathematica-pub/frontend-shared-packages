import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { min } from 'd3';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  throttleTime,
} from 'rxjs';
import { DataMarks } from '../data-marks/data-marks';
import { DATA_MARKS } from '../data-marks/data-marks.token';

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
})
export class ChartComponent
  implements OnInit, OnChanges, AfterContentInit, OnDestroy
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
  unlistenTouchStart: () => void;
  unlistenMouseWheel: () => void;
  aspectRatio: number;
  svgDimensions$: Observable<Dimensions>;
  ranges$: Observable<Ranges>;
  heightSubject = new Subject<number>();
  height$ = this.heightSubject.asObservable();

  constructor(private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['width'] || changes['height']) {
      this.setAspectRatio();
    }
    if (changes['height']) {
      this.heightSubject.next(this.height);
    }
  }

  ngOnInit(): void {
    this.setAspectRatio();
    this.createDimensionObservables();
  }

  ngAfterContentInit(): void {
    if (!this.dataMarksComponent) {
      throw new Error('DataMarksComponent not found.');
    } else if (this.dataMarksComponent.config.tooltip.show) {
      this.setPointerEventListeners();
    }
  }

  ngOnDestroy(): void {
    if (this.dataMarksComponent?.config.tooltip.show) {
      this.unlistenTouchStart();
      this.unlistenMouseWheel();
    }
  }

  setAspectRatio(): void {
    this.aspectRatio = this.width / this.height;
  }

  createDimensionObservables() {
    let divWidth$: Observable<number>;

    if (this.scaleChartWithContainer) {
      divWidth$ = this.getDivWidthResizeObservable().pipe(
        throttleTime(100),
        startWith(min([this.divRef.nativeElement.offsetWidth, this.width])),
        distinctUntilChanged()
      );
    } else {
      divWidth$ = of(this.width);
    }

    const height$ = this.height$.pipe(startWith(this.height));

    this.svgDimensions$ = combineLatest([divWidth$, height$]).pipe(
      map(([divWidth, height]) => this.getSvgDimensionsFromDivWidth(divWidth))
    );

    this.ranges$ = this.svgDimensions$.pipe(
      map((dimensions) => this.getRangesFromSvgDimensions(dimensions)),
      shareReplay()
    );
  }

  getDivWidthResizeObservable(): Observable<number> {
    const el = this.divRef.nativeElement;
    return new Observable((subscriber) => {
      const observer = new ResizeObserver((entries) => {
        subscriber.next(entries[0].contentRect.width);
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

  private setPointerEventListeners(): void {
    const el = this.svgRef.nativeElement;
    this.setTouchStartListener(el);
    this.setMouseWheelListener(el);
  }

  private setTouchStartListener(el: Element) {
    this.unlistenTouchStart = this.renderer.listen(
      el,
      'touchstart',
      (event) => {
        this.onTouchStart(event);
      }
    );
  }

  private onTouchStart(event: TouchEvent): void {
    event.preventDefault();
  }

  private setMouseWheelListener(el: Element) {
    this.unlistenMouseWheel = this.renderer.listen(el, 'mousewheel', () => {
      // if (this.htmlTooltip.exists) {
      //   // this.setTooltipPosition();
      // }
    });
  }
}
