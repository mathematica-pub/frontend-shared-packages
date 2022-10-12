import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
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
  overlayRef: OverlayRef;
  positionStrategy: FlexibleConnectedPositionStrategy;
  scrollStrategy: ScrollStrategy;
  size: OverlaySizeConfig;
  panelClass: string[];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private utilities: UtilitiesService,
    @Inject(DATA_MARKS) private dataMarks: DataMarks
  ) {}

  ngOnInit(): void {
    this.setOverlayParameters();
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

    if (
      this.utilities.objectChanged(changes, 'config', 'size') &&
      this.overlayRef
    ) {
      this.updateSize();
    }

    if (
      this.utilities.objectChanged(changes, 'config', 'panelClass') &&
      this.overlayRef
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
    this.overlayRef = this.overlay.create({
      ...this.size,
      panelClass: this.panelClass,
      scrollStrategy: this.scrollStrategy,
      positionStrategy: this.positionStrategy,
    });
  }

  updatePosition(): void {
    this.setPositionStrategy();
    this.overlayRef.updatePositionStrategy(this.positionStrategy);
  }

  updateSize(): void {
    this.overlayRef.updateSize(this.config.size);
  }

  updateClasses(): void {
    this.overlayRef.removePanelClass(this.panelClass);
    this.setPanelClasses();
    this.overlayRef.addPanelClass(this.panelClass);
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

  destroyOverlay(): void {
    this.overlayRef.dispose();
  }
}
