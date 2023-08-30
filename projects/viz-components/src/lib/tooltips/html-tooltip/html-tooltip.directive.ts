import {
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
  OverlaySizeConfig,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UtilitiesService } from '../../core/services/utilities.service';
import { DataMarks } from '../../data-marks/data-marks';
import { DATA_MARKS } from '../../data-marks/data-marks.token';
import {
  CdkManagedFromOriginPosition,
  HtmlTooltipConfig,
  OffsetFromOriginPosition,
} from './html-tooltip.config';

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
  positionStrategy: FlexibleConnectedPositionStrategy | GlobalPositionStrategy;
  size: OverlaySizeConfig;
  panelClass: string[];
  backdropUnsubscribe: Subject<void> = new Subject<void>();
  portalAttached = false;
  _document: Document;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private utilities: UtilitiesService,
    @Inject(DATA_MARKS) private dataMarks: DataMarks,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Optional() @Inject(DOCUMENT) document: any
  ) {
    this._document = document;
  }

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
    if (
      this.configChanged(changes, 'panelClass') ||
      this.configChanged(changes, 'disableEventsOnTooltip')
    ) {
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
    if (this.config.position) {
      if (this.config.position.type === 'connected') {
        this.setConnectedPositionStrategy(
          origin.nativeElement,
          this.config.position
        );
      } else {
        this.setGlobalPositionStrategy(
          origin.nativeElement,
          this.config.position
        );
      }
    }
  }

  setConnectedPositionStrategy(
    origin: Element,
    position: CdkManagedFromOriginPosition
  ): void {
    this.positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions([position.config]);
  }

  setGlobalPositionStrategy(
    origin: Element,
    position: OffsetFromOriginPosition
  ): void {
    // body.client gets dims without scrollbar thickness if scrollbar is on html or body
    // this is needed if using cdk centerHorizontally
    const _window = this._document.defaultView || window;
    const viewport = {
      width: _window.document.body.clientWidth,
      height: _window.document.body.clientHeight,
    };
    const originDims = origin.getBoundingClientRect();
    if (
      position.tooltipOriginX === 'center' &&
      position.tooltipOriginY === 'bottom'
    ) {
      this.positionStrategy = this.overlayPositionBuilder
        .global()
        .bottom(`${viewport.height - originDims.top - position.offsetY}px`)
        .centerHorizontally(
          `${-2 * (viewport.width / 2 - originDims.left - position.offsetX)}px`
        );
    } else {
      this.positionStrategy = this.overlayPositionBuilder.global();
    }
  }

  setPanelClasses(): void {
    const userClasses = this.config.panelClass
      ? [this.config.panelClass].flat()
      : [];
    this.panelClass = [defaultPanelClass, ...userClasses].flat();
    if (this.config.addEventsDisabledClass) {
      this.panelClass.push('events-disabled');
    }
  }

  createOverlay(): void {
    this.overlayRef = this.overlay.create({
      ...this.size,
      panelClass: this.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.close(),
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
