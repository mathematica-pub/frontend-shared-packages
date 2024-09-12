import {
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
  PositionStrategy,
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
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { NgOnChangesUtilities } from 'projects/app-dev-kit/src/public-api';
import { Subject, takeUntil } from 'rxjs';
import { DataMarksOptions } from '../../data-marks/config/data-marks-options';
import { DataMarks, VIC_DATA_MARKS } from '../../data-marks/data-marks-base';
import { HtmlTooltipConfig } from './config/html-tooltip-config';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'vic-html-tooltip',
})
export class HtmlTooltipDirective<
    Datum,
    TDataMarksConfig extends DataMarksOptions<Datum>,
  >
  implements OnChanges, OnDestroy
{
  @Input() template: TemplateRef<HTMLElement>;
  @Input() config: HtmlTooltipConfig;
  @Output() backdropClick = new EventEmitter<void>();
  backdropUnsubscribe: Subject<void> = new Subject<void>();
  overlayRef: OverlayRef;
  portalAttached = false;
  positionStrategy: FlexibleConnectedPositionStrategy | GlobalPositionStrategy;
  log: boolean = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    @Optional()
    @Inject(VIC_DATA_MARKS)
    private dataMarks: DataMarks<Datum, TDataMarksConfig>,
    @Inject(DOCUMENT) private document: Document
  ) {}

  init(): void {
    if (!this.overlayRef) {
      this.createOverlayRef();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.overlayRef && this.config) {
      this.updateForConfigChanges(changes);
    } else if (this.config) {
      this.init();
    }
  }

  createOverlayRef(): void {
    this.backdropUnsubscribe = new Subject<void>();
    this.overlayRef = this.overlay.create({
      ...this.config.size,
      panelClass: this.config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.getPositionStrategy(),
      hasBackdrop: this.config.hasBackdrop,
      backdropClass: 'vic-html-tooltip-backdrop',
    });
    setTimeout(() => {
      return;
    }, 0);

    if (this.config.hasBackdrop) {
      this.subscribeToBackdropClick();
    }

    this.updateVisibility();
  }

  getPositionStrategy(): PositionStrategy {
    const origin = this.config.origin ?? this.dataMarks.chart.svgRef;
    return this.config.position.getPositionStrategy(
      origin.nativeElement,
      this.overlayPositionBuilder,
      this.document
    );
  }

  subscribeToBackdropClick(): void {
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.backdropUnsubscribe))
      .subscribe(() => {
        this.backdropClick.emit();
      });
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

  updateForConfigChanges(changes: SimpleChanges): void {
    if (this.configChanged(changes, 'position')) {
      this.updatePosition();
    }
    if (this.configChanged(changes, 'panelClass')) {
      this.updateClasses(changes['config'].previousValue.panelClass);
    }
    if (this.configChanged(changes, 'size')) {
      this.updateSize();
    }
    if (this.configChanged(changes, 'hasBackdrop')) {
      this.updateBackdrop();
    }
    this.updateVisibility();
  }

  updatePosition(): void {
    const strategy = this.getPositionStrategy();
    this.overlayRef.updatePositionStrategy(strategy);
  }

  updateClasses(prevClass: string[]): void {
    this.overlayRef.removePanelClass(prevClass);
    this.overlayRef.addPanelClass(this.config.panelClass);
  }

  updateSize(): void {
    this.overlayRef.updateSize(this.config.size);
  }

  updateBackdrop(): void {
    this.destroyBackdropSubscription();
    this.hide();
    this.destroyOverlay();
    this.createOverlayRef();
  }

  configChanged(
    changes: SimpleChanges,
    property: keyof HtmlTooltipConfig
  ): boolean {
    return NgOnChangesUtilities.inputObjectChanged(changes, 'config', property);
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
