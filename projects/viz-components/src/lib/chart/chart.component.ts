import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
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
import { BehaviorSubject, takeUntil, throttleTime } from 'rxjs';
import { DomainPadding } from '../data-marks/data-dimension.model';
import { DataMarksComponent } from '../data-marks/data-marks.model';
import { DATA_MARKS_COMPONENT } from '../data-marks/data-marks.token';
import { HtmlTooltipConfig } from '../html-tooltip/html-tooltip.model';
import { Unsubscribe } from '../shared/unsubscribe.class';
import { ValueUtilities } from '../shared/value-utilities.class';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { ElementSpacing } from '../xy-chart-space/xy-chart-space.model';

@Component({
  selector: 'm-charts-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent
  extends Unsubscribe
  implements OnInit, OnChanges, AfterViewInit, AfterContentInit, OnDestroy
{
  unlistenPointerEnter: () => void;
  unlistenPointerMove: () => void;
  unlistenPointerLeave: () => void;
  unlistenTouchStart: () => void;
  unlistenMouseWheel: () => void;
  @ContentChild(XYChartSpaceComponent) xySpace: XYChartSpaceComponent;
  @ContentChild(DATA_MARKS_COMPONENT) dataMarksComponent: DataMarksComponent;
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
  sizeChange: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  aspectRatio: number;
  htmlTooltip: HtmlTooltipConfig = new HtmlTooltipConfig();

  constructor(private renderer: Renderer2, private zone: NgZone) {
    super();
  }

  @HostListener('window:resize', ['$event.target'])
  onResize() {
    if (this.chartShouldScale()) {
      this.sizeChange.next();
    }
  }

  ngOnInit(): void {
    this.setAspectRatio();
    this.subscribeToSizeChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['width'] || changes['height']) {
      this.setAspectRatio();
    }
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

  override ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    if (this.dataMarksComponent?.config.showTooltip) {
      this.unlistenTouchStart();
      this.unlistenPointerEnter();
      this.unlistenMouseWheel();
    }
  }

  subscribeToSizeChange() {
    this.sizeChange
      .asObservable()
      .pipe(throttleTime(100), takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.resizeDataMarks();
      });
  }

  resizeDataMarks(): void {
    if (this.dataMarksComponent) {
      this.dataMarksComponent.resizeMarks();
    }
  }

  chartShouldScale(): boolean {
    return (
      this.scaleChartWithContainer &&
      this.divRef.nativeElement.offsetWidth <= this.width
    );
  }

  getSvgWidth(): any {
    return !this.scaleChartWithContainer
      ? this.width
      : this.divRef.nativeElement.offsetWidth;
  }

  setAspectRatio(): void {
    this.aspectRatio = this.width / this.height;
  }

  getScaledWidth(): number {
    return this.chartShouldScale()
      ? this.divRef.nativeElement.offsetWidth
      : this.width;
  }

  getScaledHeight(): number {
    return this.chartShouldScale()
      ? this.divRef.nativeElement.offsetWidth / this.aspectRatio
      : this.height;
  }

  getXRange(): [number, number] {
    return [this.margin.left, this.getScaledWidth() - this.margin.right];
  }

  getYRange(): [number, number] {
    return [this.getScaledHeight() - this.margin.bottom, this.margin.top];
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
