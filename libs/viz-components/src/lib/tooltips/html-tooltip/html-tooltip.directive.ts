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
  Output,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { NgOnChangesUtilities } from '@mathstack/app-kit';
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
  onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.hide();
    }
  };

  constructor(
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    @Inject(DOCUMENT) private document: Document
  ) { }

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

    this.setPositionStrategy();
    this.overlayRef = this.overlay.create({
      ...this.config.size,
      panelClass: this.config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.positionStrategy,
      hasBackdrop: this.config.hasBackdrop,
      backdropClass: 'vic-html-tooltip-backdrop',
    });

    if (this.config.hasBackdrop) {
      this.subscribeToBackdropClick();
    }
    this.updateVisibility();
  }

  setPositionStrategy(): void {
    if (!this.config.origin || !this.config.position) {
      this.positionStrategy = this.overlayPositionBuilder.global();
      return;
    }

    this.positionStrategy = this.config.position.getPositionStrategy(
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

  subscribeToKeyboardEvents(): void {
    this.document.addEventListener('keydown', this.onKeydown, true);
  }

  unsubscribeFromKeyboardEvents(): void {
    this.document.removeEventListener('keydown', this.onKeydown, true);
  }

  show(): void {
    const tooltipPortal = this.getTemplatePortal();

    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(tooltipPortal);
      this.subscribeToKeyboardEvents();

      requestAnimationFrame(() => {
        this.updatePositionStrategy();
      });
    } else {
      this.updatePositionStrategy();
    }
  }

  getTemplatePortal(): TemplatePortal {
    return new TemplatePortal(this.template, this.viewContainerRef);
  }

  hide(): void {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
      this.unsubscribeFromKeyboardEvents();
    }
  }

  updateForConfigChanges(changes: SimpleChanges): void {
    if (this.configChanged(changes, 'position')) {
      this.updatePositionStrategy();
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

  updatePositionStrategy(): void {
    this.setPositionStrategy();
    if (this.positionStrategy) {
      // Only update if we have a valid strategy
      this.overlayRef.updatePositionStrategy(this.positionStrategy);
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
    this.unsubscribeFromKeyboardEvents();
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
