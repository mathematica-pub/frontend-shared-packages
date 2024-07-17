import {
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
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
import { NgOnChangesUtilities } from '../../core/utilities/ng-on-changes';
import { VicDataMarksOptions } from '../../data-marks/config/data-marks-options';
import {
  VIC_DATA_MARKS,
  VicDataMarks,
} from '../../data-marks/data-marks-component';
import {
  VicHtmlTooltipCdkManagedFromOriginPosition,
  VicHtmlTooltipConfig,
  VicHtmlTooltipOffsetFromOriginPosition,
} from './html-tooltip.config';

const defaultPanelClass = 'vic-html-tooltip-overlay';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'vic-html-tooltip',
})
export class VicHtmlTooltipDirective<
  Datum,
  TDataMarksConfig extends VicDataMarksOptions<Datum>
> implements OnInit, OnChanges, OnDestroy
{
  @Input() template: TemplateRef<unknown>;
  @Input() config: VicHtmlTooltipConfig;
  @Output() backdropClick = new EventEmitter<void>();
  overlayRef: OverlayRef;
  positionStrategy: FlexibleConnectedPositionStrategy | GlobalPositionStrategy;
  panelClass: string[];
  backdropUnsubscribe: Subject<void> = new Subject<void>();
  portalAttached = false;
  _document: Document;

  constructor(
    // provisionally leaving as private per discussion here: https://github.com/mathematica-org/viz-components/pull/189
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    @Optional()
    @Inject(VIC_DATA_MARKS)
    private dataMarks: VicDataMarks<Datum, TDataMarksConfig>,
    @Optional() @Inject(DOCUMENT) document: Document
  ) {
    this._document = document;
  }

  ngOnInit(): void {
    if (this.config) {
      this.init();
    }
  }

  init(): void {
    if (!this.overlayRef) {
      this.createOverlay();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.overlayRef && this.config) {
      this.checkPositionChanges(changes);
      this.checkClassChanges(changes);
      this.checkSizeChanges(changes);
      this.checkBackdropChanges(changes);
      this.updateVisibility();
    } else if (this.config) {
      this.init();
    }
  }

  configChanged(
    changes: SimpleChanges,
    property: keyof VicHtmlTooltipConfig
  ): boolean {
    return NgOnChangesUtilities.inputObjectChanged(changes, 'config', property);
  }

  checkPositionChanges(changes: SimpleChanges): void {
    if (this.configChanged(changes, 'position')) {
      this.updatePosition();
    }
  }

  checkClassChanges(changes: SimpleChanges): void {
    if (
      this.configChanged(changes, 'panelClass') ||
      this.configChanged(changes, 'addEventsDisabledClass')
    ) {
      this.updateClasses();
    }
  }

  checkSizeChanges(changes: SimpleChanges): void {
    if (this.configChanged(changes, 'size')) {
      this.updateSize();
    }
  }

  checkBackdropChanges(changes: SimpleChanges): void {
    if (
      this.configChanged(changes, 'hasBackdrop') ||
      this.configChanged(changes, 'closeOnBackdropClick')
    ) {
      this.updateForNewBackdropProperties();
    }
  }

  updatePosition(): void {
    this.setPositionStrategy();
    this.overlayRef.updatePositionStrategy(this.positionStrategy);
  }

  updateClasses(): void {
    this.overlayRef.removePanelClass(this.panelClass);
    this.setPanelClasses();
    this.overlayRef.addPanelClass(this.panelClass);
  }

  updateSize(): void {
    this.overlayRef.updateSize(this.config.size);
  }

  updateForNewBackdropProperties(): void {
    this.destroyBackdropSubscription();
    this.hide();
    this.destroyOverlay();
    this.backdropUnsubscribe = new Subject<void>();
    this.createOverlay();
  }

  updateVisibility(): void {
    if (this.overlayRef) {
      if (this.config.show) {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  show(): void {
    const tooltipPortal = this.getTemplatePortal();
    this.updatePosition();
    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(tooltipPortal);
    }
  }

  getTemplatePortal(): TemplatePortal {
    return new TemplatePortal(this.template, this.viewContainerRef);
  }

  hide(): void {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  createOverlay(): void {
    this.setPanelClasses();
    this.setPositionStrategy();
    this.overlayRef = this.overlay.create({
      ...this.config.size,
      panelClass: this.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.positionStrategy,
      hasBackdrop: this.config.hasBackdrop,
      backdropClass: 'vic-html-tooltip-backdrop',
    });
    setTimeout(() => {
      return;
    }, 0);

    if (this.config.hasBackdrop && this.config.closeOnBackdropClick) {
      this.listenForBackdropClicks();
    }

    this.updateVisibility();
  }

  listenForBackdropClicks(): void {
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.backdropUnsubscribe))
      .subscribe(() => {
        this.backdropClick.emit();
      });
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
    position: VicHtmlTooltipCdkManagedFromOriginPosition
  ): void {
    this.positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions([position.config]);
  }

  setGlobalPositionStrategy(
    origin: Element,
    position: VicHtmlTooltipOffsetFromOriginPosition
  ): void {
    // gets dims without scrollbar thickness if scrollbar is on html or body
    const _window = this._document.defaultView || window;
    const viewport = {
      width: _window.document.body.clientWidth,
      height: _window.document.body.clientHeight,
    };
    const originDims = origin.getBoundingClientRect();
    this.positionStrategy = this.overlayPositionBuilder
      .global()
      .bottom(`${viewport.height - originDims.top - position.offsetY}px`)
      .centerHorizontally(
        `${-2 * (viewport.width / 2 - originDims.left - position.offsetX)}px`
      );
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

  ngOnDestroy(): void {
    this.destroyBackdropSubscription();
    this.destroyOverlay();
  }

  destroyBackdropSubscription(): void {
    this.backdropUnsubscribe.next();
    this.backdropUnsubscribe.complete();
  }

  destroyOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
