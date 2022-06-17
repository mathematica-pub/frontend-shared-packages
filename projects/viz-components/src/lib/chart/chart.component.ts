import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { min } from 'd3';
import {
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
  startWith,
  throttleTime,
} from 'rxjs';
import { DomainPadding } from '../data-marks/data-dimension.model';
import { DataMarks } from '../data-marks/data-marks.model';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { HtmlTooltipConfig } from '../html-tooltip/html-tooltip.model';
import { ValueUtilities } from '../shared/value-utilities.class';
import { XyChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { ElementSpacing } from '../xy-chart-space/xy-chart-space.model';
import { Dimensions, Ranges } from './chart.model';

@Component({
  selector: 'vzc-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent
  implements OnInit, OnChanges, AfterViewInit, AfterContentInit, OnDestroy
{
  unlistenPointerEnter: () => void;
  unlistenPointerMove: () => void;
  unlistenPointerLeave: () => void;
  unlistenTouchStart: () => void;
  unlistenMouseWheel: () => void;
  @ContentChild(XyChartSpaceComponent) xySpace: XyChartSpaceComponent;
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
  @Output() tooltipData = new EventEmitter<any>();
  aspectRatio: number;
  htmlTooltip: HtmlTooltipConfig = new HtmlTooltipConfig();
  ranges$: Observable<Ranges>;
  svgDimensions$: Observable<Dimensions>;

  constructor(private renderer: Renderer2, private zone: NgZone) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['width'] || changes['height']) {
      this.setAspectRatio();
    }
  }

  ngOnInit(): void {
    this.setAspectRatio();
    this.createDimensionObservables();
  }

  ngAfterContentInit(): void {
    if (!this.dataMarksComponent) {
      throw new Error('DataMarksComponent not found.');
    } else if (this.dataMarksComponent.config.showTooltip) {
      this.setPointerEventListeners();
    }
  }

  ngAfterViewInit(): void {
    if (this.htmlTooltip.exists) {
      this.setTooltipPosition();
    }
  }

  ngOnDestroy(): void {
    if (this.dataMarksComponent?.config.showTooltip) {
      this.unlistenTouchStart();
      this.unlistenPointerEnter();
      this.unlistenMouseWheel();
    }
  }

  setAspectRatio(): void {
    this.aspectRatio = this.width / this.height;
  }

  createDimensionObservables() {
    this.svgDimensions$ = this.getDivWidthResizeObservable().pipe(
      throttleTime(100),
      startWith(min([this.divRef.nativeElement.offsetWidth, this.width])),
      distinctUntilChanged(),
      map((divWidth) => this.getSvgDimensionsFromDivWidth(divWidth)),
      shareReplay()
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
    this.setPointerEnterListener(el);
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

  private setPointerEnterListener(el: Element) {
    this.unlistenPointerEnter = this.renderer.listen(
      el,
      'pointerenter',
      (event) => {
        this.onPointerEnter(event, el);
      }
    );
  }

  private onPointerEnter(event: PointerEvent, el: Element): void {
    this.dataMarksComponent.onPointerEnter(event);
    this.setPointerMoveListener(el);
    this.setPointerLeaveListener(el);
  }

  private setPointerMoveListener(el) {
    this.zone.runOutsideAngular(() => {
      // run outside angular to prevent CD on every mousemove
      this.unlistenPointerMove = this.renderer.listen(
        el,
        'pointermove',
        (event) => {
          this.dataMarksComponent.onPointerMove(event);
        }
      );
    });
  }

  private setPointerLeaveListener(el: Element) {
    this.unlistenPointerLeave = this.renderer.listen(
      el,
      'pointerleave',
      (event) => {
        this.dataMarksComponent.onPointerLeave(event);
        this.unlistenPointerMove();
        this.unlistenPointerLeave();
      }
    );
  }

  private setMouseWheelListener(el: Element) {
    this.unlistenMouseWheel = this.renderer.listen(el, 'mousewheel', () => {
      if (this.htmlTooltip.exists) {
        this.setTooltipPosition();
      }
    });
  }

  setTooltipPosition(): void {
    this.htmlTooltip.position.top =
      this.divRef.nativeElement.getBoundingClientRect().y;
    this.htmlTooltip.position.left =
      this.divRef.nativeElement.getBoundingClientRect().x;
  }

  emitTooltipData<T>(data: T): void {
    this.tooltipData.emit(data);
  }

  getPaddedDomainValue(value: number, padding: DomainPadding) {
    let paddedValue = value;
    if (padding.type === 'round') {
      paddedValue = this.getQuantitativeDomainMaxRoundedUp(
        value,
        padding.sigDigits
      );
    } else if (padding.type === 'percent') {
      paddedValue = this.getQuantitativeDomainMaxPercentOver(
        value,
        padding.sigDigits,
        padding.percent
      );
    }
    return paddedValue;
  }

  getQuantitativeDomainMaxRoundedUp(value: number, sigDigits: number) {
    return ValueUtilities.getValueRoundedUpNSignificantDigits(value, sigDigits);
  }

  getQuantitativeDomainMaxPercentOver(
    value: number,
    sigDigits: number,
    percent: number
  ) {
    const overValue = value * (1 + percent);
    return ValueUtilities.getValueRoundedUpNSignificantDigits(
      overValue,
      sigDigits
    );
  }
}
