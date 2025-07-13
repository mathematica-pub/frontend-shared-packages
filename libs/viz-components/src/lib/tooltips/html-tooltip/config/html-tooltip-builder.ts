import { ElementRef, Injectable } from '@angular/core';
import { safeAssign } from '@hsi/app-dev-kit';
import { BaseInteractionOutput } from '../../../events/interaction-output';
import { HtmlTooltipConfig } from './html-tooltip-config';
import { HtmlTooltipCdkManagedPosition } from './position/tooltip-position';
import { HtmlTooltipSizeBuilder } from './size/tooltip-size-builder';

const DEFAULT = {
  _minWidth: 300,
};

@Injectable()
export class VicHtmlTooltipConfigBuilder {
  private _applyEventsDisabledClass: boolean;
  private sizeBuilder: HtmlTooltipSizeBuilder;
  private _panelClass: string | string[];
  private _origin: ElementRef<Element>;
  private _hasBackdrop: boolean;
  private _position: HtmlTooltipCdkManagedPosition;
  private _show: boolean;

  constructor() {
    safeAssign(this, DEFAULT);
    this.sizeBuilder = new HtmlTooltipSizeBuilder();
    this._applyEventsDisabledClass = false;
  }

  size(size: null): this;
  size(size: (size: HtmlTooltipSizeBuilder) => void): this;
  size(size: ((size: HtmlTooltipSizeBuilder) => void) | null): this {
    if (size === null) {
      this.sizeBuilder = undefined;
      return this;
    }
    this.initSizeBuilder();
    size(this.sizeBuilder);
    return this;
  }

  private initSizeBuilder(): void {
    this.sizeBuilder = new HtmlTooltipSizeBuilder();
  }

  /**
   * OPTIONAL. Will create a Material CDK-provided backdrop if set to true. Clicking on the backdrop will dismiss the backdrop and emit an event.
   *
   * @default false
   */
  hasBackdrop(hasBackdrop: boolean): this {
    this._hasBackdrop = hasBackdrop;
    return this;
  }

  /**
   * @deprecated Use .positionFromOrigin(...) and a positioning method from the interaction output instead.
   */
  origin(origin: ElementRef<Element>): this {
    this._origin = origin;
    return this;
  }

  applyEventsDisabledClass(apply: boolean): this {
    this._applyEventsDisabledClass = apply;
    return this;
  }

  panelClass(panelClass: string | string[]): this {
    this._panelClass = panelClass;
    return this;
  }

  // positionFromOrigin(
  //   origin: Element,
  //   position: HtmlTooltipCdkManagedPosition
  // ): this {
  //   this._origin = origin ? new ElementRef(origin) : undefined;
  //   this._position = position;
  //   return this;
  // }

  positionFromOutput(
    output: BaseInteractionOutput,
    position?: HtmlTooltipCdkManagedPosition
  ): this {
    this._origin = output?.origin ? new ElementRef(output.origin) : undefined;
    if (output) {
      this._position = position || output?.defaultPosition;
    }
    return this;
  }

  // /**
  //  * @deprecated Use .positionFromOrigin(...) and a positioning method from the interaction output instead.
  //  */
  // barsPosition(
  //   origin: SVGRectElement,
  //   positions: Partial<ConnectedPosition>[]
  // ): this {
  //   console.warn(
  //     '[vic-html-tooltip] .barsPosition(...) is deprecated. Use .positionFromOutput(...) and optionally, a positioning method from the interaction output instead.'
  //   );
  //   this._origin = origin ? new ElementRef(origin) : undefined;
  //   const barsPositions = positions.map(
  //     (p) => new RelativeToTopLeftTooltipPosition(p)
  //   );
  //   this._position = new HtmlTooltipCdkManagedPosition(barsPositions);
  //   return this;
  // }

  // /**
  //  * @deprecated Use .positionFromOrigin(...) and a positioning method from the interaction output instead.
  //  */
  // dotsPosition(
  //   origin: SVGCircleElement,
  //   positions: Partial<ConnectedPosition>[]
  // ): this {
  //   console.warn(
  //     '[vic-html-tooltip] .dotsPosition(...) is deprecated. Use .positionFromOutput(...) and optionally, a positioning method from the interaction output instead.'
  //   );
  //   this.origin(origin ? new ElementRef(origin) : undefined);
  //   const dotsPositions = positions.map(
  //     (p) => new RelativeToCenterTooltipPosition(p)
  //   );
  //   this._position = new HtmlTooltipCdkManagedPosition(dotsPositions);
  //   return this;
  // }

  // /**
  //  * @deprecated Use .positionFromOrigin(...) and a positioning method from the interaction output instead.
  //  */
  // geographiesPosition(
  //   origin: SVGPathElement,
  //   positions: Partial<ConnectedPosition>[]
  // ): this {
  //   console.warn(
  //     '[vic-html-tooltip] .geographiesPosition(...) is deprecated. Use .positionFromOutput(...) and optionally, a positioning method from the interaction output instead.'
  //   );
  //   this.origin(origin ? new ElementRef(origin) : undefined);
  //   const geographiesPositions = positions.map(
  //     (p) => new RelativeToTopLeftTooltipPosition(p)
  //   );
  //   this._position = new HtmlTooltipCdkManagedPosition(geographiesPositions);
  //   return this;
  // }

  // /**
  //  * @deprecated Use .positionFromOrigin(...) and a positioning method from the interaction output instead.
  //  */
  // linesPosition(positions: Partial<ConnectedPosition>[]): this {
  //   console.warn(
  //     '[vic-html-tooltip] .linesPosition(...) is deprecated. Use .positionFromOutput(...) and optionally, a positioning method from the interaction output instead.'
  //   );
  //   const linesPositions = positions.map(
  //     (p) => new RelativeToTopLeftTooltipPosition(p)
  //   );
  //   this._position = new HtmlTooltipCdkManagedPosition(linesPositions);
  //   return this;
  // }

  // /**
  //  * @deprecated Use .positionFromOrigin(...) and a positioning method from the interaction output instead.
  //  */
  // stackedAreaPosition(positions: Partial<ConnectedPosition>[]): this {
  //   console.warn(
  //     '[vic-html-tooltip] .stackedAreaPosition(...) is deprecated. Use .positionFromOutput(...) and optionally, a positioning method from the interaction output instead.'
  //   );
  //   const stackedAreaPositions = positions.map(
  //     (p) => new RelativeToTopLeftTooltipPosition(p)
  //   );
  //   this._position = new HtmlTooltipCdkManagedPosition(stackedAreaPositions);
  //   return this;
  // }

  show(show: boolean): this {
    this._show = show;
    return this;
  }

  getConfig(): HtmlTooltipConfig {
    this.validateBuilder();
    console.log('[vic-html-tooltip] getConfig() called with:', {
      hasBackdrop: this._hasBackdrop,
      panelClass: this._panelClass,
      origin: this._origin,
      position: this._position,
      show: this._show,
      size: this.sizeBuilder,
    });
    return new HtmlTooltipConfig({
      hasBackdrop: this._hasBackdrop,
      panelClass: this.getPanelClasses(),
      origin: this._origin,
      position: this._position,
      show: this._show,
      size: this.sizeBuilder._build(),
    });
  }

  private validateBuilder(): void {
    if (!this.sizeBuilder) {
      this.initSizeBuilder();
    }
    if (!this._position) {
      throw new Error('Position must be set');
    }
  }

  private getPanelClasses(): string[] {
    const userClasses = this._panelClass ? [this._panelClass].flat() : [];
    const panelClasses = ['vic-html-tooltip-overlay', ...userClasses].flat();
    if (this._applyEventsDisabledClass) {
      panelClasses.push('events-disabled');
    }
    return panelClasses;
  }
}
