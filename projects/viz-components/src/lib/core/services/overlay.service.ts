import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  overlayRef: OverlayRef;

  constructor(private overlay: Overlay) {}

  createOverlay(config?: OverlayConfig): void {
    if (config) {
      if (this.overlayRef) {
        this.overlayRef.dispose();
      }
      this.overlayRef = this.overlay.create(config);
    } else if (!this.overlayRef) {
      this.overlayRef = this.overlay.create();
    }
  }

  disposeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }
}
