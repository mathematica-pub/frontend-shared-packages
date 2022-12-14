import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlaySizeConfig,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Directive,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { OverlayService } from '../core/services/overlay.service';
import { UtilitiesService } from '../core/services/utilities.service';
import { DataMarks } from '../data-marks/data-marks';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { HtmlTooltipConfig } from './html-tooltip.config';

const defaultPanelClass = 'vic-html-tooltip-overlay';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'vic-html-tooltip',
})
export class HtmlTooltipDirective implements OnInit, OnChanges, OnDestroy {
  @Input() template: TemplateRef<unknown>;
  @Input() config: HtmlTooltipConfig;
  positionStrategy: FlexibleConnectedPositionStrategy;
  scrollStrategy: ScrollStrategy;
  size: OverlaySizeConfig;
  panelClass: string[];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private utilities: UtilitiesService,
    private overlayService: OverlayService,
    @Inject(DATA_MARKS) private dataMarks: DataMarks
  ) {}

  ngOnInit(): void {
    this.setOverlayParameters();
    this.createOverlay();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.utilities.objectChanged(changes, 'config', 'show') &&
      this.overlayService.overlayRef
    ) {
      if (this.config.show) {
        this.show();
      } else {
        this.hide();
      }
    }

    if (
      this.utilities.objectChanged(changes, 'config', 'position') &&
      this.overlayService.overlayRef
    ) {
      this.updatePosition();
    }

    if (
      this.utilities.objectChanged(changes, 'config', 'size') &&
      this.overlayService.overlayRef
    ) {
      this.updateSize();
    }

    if (
      this.utilities.objectChanged(changes, 'config', 'panelClass') &&
      this.overlayService.overlayRef
    ) {
      this.updateClasses();
    }
  }

  ngOnDestroy(): void {
    this.destroyOverlay();
  }

  setOverlayParameters(): void {
    this.setPositionStrategy();
    this.setPanelClasses();
    this.setScrollStrategy();
  }

  setPositionStrategy(): void {
    const origin = this.config.origin ?? this.dataMarks.chart.svgRef;
    const position = this.config.position;
    this.positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions([position]);
  }

  setPanelClasses(): void {
    const userClasses = this.config.panelClass
      ? [this.config.panelClass].flat()
      : [];
    this.panelClass = [defaultPanelClass, ...userClasses].flat();
    if (this.config.disableEventsOnTooltip) {
      this.panelClass.push('events-disabled');
    }
  }

  setScrollStrategy(): void {
    this.scrollStrategy = this.overlay.scrollStrategies.close();
  }

  createOverlay(): void {
    this.overlayService.createOverlay({
      ...this.size,
      panelClass: this.panelClass,
      scrollStrategy: this.scrollStrategy,
      positionStrategy: this.positionStrategy,
    });
  }

  updatePosition(): void {
    this.setPositionStrategy();
    this.overlayService.overlayRef.updatePositionStrategy(
      this.positionStrategy
    );
  }

  updateSize(): void {
    this.overlayService.overlayRef.updateSize(this.config.size);
  }

  updateClasses(): void {
    this.overlayService.overlayRef.removePanelClass(this.panelClass);
    this.setPanelClasses();
    this.overlayService.overlayRef.addPanelClass(this.panelClass);
  }

  show(): void {
    const tooltipPortal = new TemplatePortal(
      this.template,
      this.viewContainerRef
    );
    this.overlayService.overlayRef.attach(tooltipPortal);
  }

  hide(): void {
    this.overlayService.overlayRef.detach();
  }

  destroyOverlay(): void {
    this.overlayService.overlayRef.dispose();
  }
}
