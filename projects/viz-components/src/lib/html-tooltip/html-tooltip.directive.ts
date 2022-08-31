import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ChartComponent } from '../chart/chart.component';

/** Default position for the overlay. Follows the behavior of a tooltip. */
const defaultPosition: ConnectedPosition = {
  originX: 'start',
  originY: 'top',
  overlayX: 'center',
  overlayY: 'bottom',
};

const defaultPanelClass = 'vic-html-tooltip-overlay';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'vic-html-tooltip',
})
export class HtmlTooltipDirective implements OnInit, OnChanges {
  @Input() template: TemplateRef<unknown>;
  @Input() showTooltip: boolean;
  @Input() position: ConnectedPosition;
  @Input() scrollStrategy?: ScrollStrategy;
  @Input() origin?: ElementRef;
  @Input() disableEventsOnTooltip = true;
  overlayRef: OverlayRef;
  positionStrategy: FlexibleConnectedPositionStrategy;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    @Optional() private chart: ChartComponent
  ) {}

  ngOnInit(): void {
    this.setPositionStrategy();
    this.setScrollStrategy();
    this.createOverlay();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showTooltip'] && this.overlayRef) {
      if (this.showTooltip) {
        this.show();
      } else {
        this.hide();
      }
    }

    if (changes['position'] && this.overlayRef) {
      this.updatePosition();
    }
  }

  setPositionStrategy(): void {
    const origin = this.origin ?? this.chart.svgRef;
    const position = this.position ?? defaultPosition;
    position.panelClass = this.getOverlayClasses();
    this.positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions([position]);
  }

  getOverlayClasses(): string[] {
    const positionClasses = this.position.panelClass
      ? Array.isArray(this.position.panelClass)
        ? this.position.panelClass
        : [this.position.panelClass]
      : [];
    const classes = [defaultPanelClass, ...positionClasses];
    if (this.disableEventsOnTooltip) {
      classes.push('events-disabled');
    }
    return classes;
  }

  setScrollStrategy(): void {
    if (!this.scrollStrategy) {
      this.scrollStrategy = this.overlay.scrollStrategies.close();
    }
  }

  createOverlay(): void {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy: this.scrollStrategy,
    });
  }

  updatePosition(): void {
    this.setPositionStrategy();
    this.overlayRef.updatePositionStrategy(this.positionStrategy);
  }

  show(): void {
    const tooltipPortal = new TemplatePortal(
      this.template,
      this.viewContainerRef
    );
    this.overlayRef.attach(tooltipPortal);
  }

  hide(): void {
    this.overlayRef.detach();
  }
}
