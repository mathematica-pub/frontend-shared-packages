import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
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

const defaultPanelClass = 'vzc-html-tooltip-overlay';

@Directive({
  selector: 'vzc-html-tooltip',
})
export class HtmlTooltipDirective implements OnInit, OnChanges {
  @Input() template: TemplateRef<unknown>;
  @Input() showTooltip: boolean;
  @Input() position: ConnectedPosition;
  @Input() origin: ElementRef;
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
    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy,
    });
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
    const classes = [defaultPanelClass];
    if (this.disableEventsOnTooltip) {
      classes.push('events-disabled');
    }
    position.panelClass = classes;
    this.positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions([position]);
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
