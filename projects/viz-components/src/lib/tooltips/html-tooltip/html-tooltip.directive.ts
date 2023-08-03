import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
  OverlaySizeConfig,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UtilitiesService } from '../../core/services/utilities.service';
import { DataMarks } from '../../data-marks/data-marks';
import { DATA_MARKS } from '../../data-marks/data-marks.token';
import { HtmlTooltipConfig } from './html-tooltip.config';

const defaultPanelClass = 'vic-html-tooltip-overlay';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'vic-html-tooltip',
})
export class HtmlTooltipDirective implements OnInit, OnChanges, OnDestroy {
  @Input() template: TemplateRef<unknown>;
  @Input() config: HtmlTooltipConfig;
  @Output() backdropClick = new EventEmitter<void>();
  overlayRef: OverlayRef;
  positionStrategy: FlexibleConnectedPositionStrategy;
  size: OverlaySizeConfig;
  panelClass: string[];
  backdropUnsubscribe: Subject<void> = new Subject<void>();
  portalAttached = false;

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
    if (this.overlayRef) {
      this.checkBackdropChanges(changes);
      this.checkShowChanges(changes);
      this.checkPositionChanges(changes);
      this.checkSizeChanges(changes);
      this.checkPanelClassChanges(changes);
    }
  }

  configChanged(changes: SimpleChanges, property: string): boolean {
    return this.utilities.objectOnNgChangesChanged(changes, 'config', property);
  }

  checkBackdropChanges(changes: SimpleChanges): void {
    if (
      this.configChanged(changes, 'hasBackdrop') ||
      this.configChanged(changes, 'closeOnBackdropClick')
    ) {
      this.updateForNewBackdropProperties();
    }
  }

  checkShowChanges(changes: SimpleChanges): void {
    if (this.configChanged(changes, 'show')) {
      this.updateVisibility();
    }
  }

  checkPositionChanges(changes: SimpleChanges): void {
    if (this.configChanged(changes, 'position')) {
      this.updatePosition();
    }
  }

  checkSizeChanges(changes: SimpleChanges): void {
    if (this.configChanged(changes, 'size')) {
      this.updateSize();
    }
  }

  checkPanelClassChanges(changes: SimpleChanges): void {
    if (this.configChanged(changes, 'panelClass')) {
      this.updateClasses();
    }
  }

  ngOnDestroy(): void {
    this.destroyBackdropSubscription();
    this.destroyOverlay();
  }

  destroyBackdropSubscription(): void {
    this.backdropUnsubscribe.next();
    this.backdropUnsubscribe.complete();
  }

  setOverlayParameters(): void {
    this.setPositionStrategy();
    this.setPanelClasses();
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

  createOverlay(): void {
    this.overlayRef = this.overlay.create({
      ...this.size,
      panelClass: this.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.positionStrategy,
      hasBackdrop: this.config.hasBackdrop,
      backdropClass: 'vic-html-tooltip-backdrop',
    });

    if (this.config.hasBackdrop && this.config.closeOnBackdropClick) {
      this.listenForBackdropClicks();
    }
  }

  listenForBackdropClicks(): void {
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.backdropUnsubscribe))
      .subscribe(() => {
        this.backdropClick.emit();
      });
  }

  updateVisibility(): void {
    if (this.config.show) {
      if (!this.portalAttached) {
        this.show();
      }
    } else {
      this.hide();
    }
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

  updateForNewBackdropProperties(): void {
    this.destroyBackdropSubscription();
    this.hide();
    this.destroyOverlay();
    this.backdropUnsubscribe = new Subject<void>();
    this.createOverlay();
    this.updateVisibility();
  }

  show(): void {
    const tooltipPortal = this.getTemplatePortal();
    this.overlayRef.attach(tooltipPortal);
    this.portalAttached = true;
  }

  getTemplatePortal(): TemplatePortal {
    return new TemplatePortal(this.template, this.viewContainerRef);
  }

  hide(): void {
    this.overlayRef.detach();
    this.portalAttached = false;
  }

  destroyOverlay(): void {
    this.overlayRef.dispose();
  }
}
