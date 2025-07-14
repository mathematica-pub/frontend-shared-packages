import {
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
  PositionStrategy,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { NgOnChangesUtilities } from '@hsi/app-dev-kit';
import { Subject, takeUntil } from 'rxjs';
import { HtmlTooltipConfig } from './config/html-tooltip-config';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'vic-html-tooltip',
})
export class HtmlTooltipDirective implements OnChanges, OnDestroy {
  @Input() template: TemplateRef<HTMLElement>;
  @Input() config: HtmlTooltipConfig;
  @Output() backdropClick = new EventEmitter<void>();
  backdropUnsubscribe: Subject<void> = new Subject<void>();
  overlayRef: OverlayRef;
  portalAttached = false;
  positionStrategy: FlexibleConnectedPositionStrategy | GlobalPositionStrategy;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder
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
      positionStrategy:
        this.getPositionStrategy() || this.overlayPositionBuilder.global(),
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

  getPositionStrategy(): PositionStrategy | null {
    if (!this.config.show || !this.config.origin || !this.config.position) {
      return null;
    }

    return this.config.position.getPositionStrategy(
      this.config.origin.nativeElement,
      this.overlayPositionBuilder
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
    if (strategy) {
      // Only update if we have a valid strategy
      this.overlayRef.updatePositionStrategy(strategy);
    }
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
