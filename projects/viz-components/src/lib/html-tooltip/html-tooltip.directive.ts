import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Directive,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { UtilitiesService } from '../core/services/utilities.service';
import { DataMarks } from '../data-marks/data-marks';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { HtmlTooltipConfig } from './html-tooltip.config';

const defaultPanelClass = 'vic-html-tooltip-overlay';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'vic-html-tooltip',
})
export class HtmlTooltipDirective implements OnInit, OnChanges {
  @Input() template: TemplateRef<unknown>;
  @Input() config: HtmlTooltipConfig;
  overlayRef: OverlayRef;
  positionStrategy: FlexibleConnectedPositionStrategy;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private utilities: UtilitiesService,
    @Inject(DATA_MARKS) private dataMarks: DataMarks
  ) {}

  ngOnInit(): void {
    this.setPositionStrategy();
    this.setScrollStrategy();
    this.createOverlay();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.utilities.objectChanged(changes, 'config', 'show') &&
      this.overlayRef
    ) {
      if (this.config.show) {
        this.show();
      } else {
        this.hide();
      }
    }

    if (
      this.utilities.objectChanged(changes, 'config', 'position') &&
      this.overlayRef
    ) {
      this.updatePosition();
    }
  }

  setPositionStrategy(): void {
    const origin = this.config.origin ?? this.dataMarks.chart.svgRef;
    const position = this.config.position;
    position.panelClass = this.getOverlayClasses();
    this.positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions([position]);
  }

  getOverlayClasses(): string[] {
    const positionClasses = this.config.position.panelClass
      ? Array.isArray(this.config.position.panelClass)
        ? this.config.position.panelClass
        : [this.config.position.panelClass]
      : [];
    const classes = [defaultPanelClass, ...positionClasses];
    if (this.config.disableEventsOnTooltip) {
      classes.push('events-disabled');
    }
    return classes;
  }

  setScrollStrategy(): void {
    if (!this.config.scrollStrategy) {
      this.config.scrollStrategy = this.overlay.scrollStrategies.close();
    }
  }

  createOverlay(): void {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy: this.config.scrollStrategy,
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
