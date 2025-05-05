import { ConnectedPosition } from '@angular/cdk/overlay';
import { ElementRef, Injectable } from '@angular/core';
import { safeAssign } from '@hsi/app-dev-kit';
import {
  RelativeToCenterTooltipPosition,
  RelativeToTopLeftTooltipPosition,
} from '../../../events/event-positions';
import { HtmlTooltipConfig } from './html-tooltip-config';
import {
  HtmlTooltipCdkManagedPosition,
  HtmlTooltipOffsetFromOriginPosition,
} from './position/tooltip-position';
import { HtmlTooltipOffsetFromOriginPositionBuilder } from './position/tooltip-position-builder';
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
  private _position:
    | HtmlTooltipCdkManagedPosition
    | HtmlTooltipOffsetFromOriginPosition;
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
   * OPTIONAL. The origin element that the tooltip will be positioned relative to
   *
   * If not provided the tooltip will be offset from the top left corner of the chart's svg element.
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

  barsPosition(
    origin: SVGRectElement,
    positions: Partial<ConnectedPosition>[]
  ): this {
    this.origin(origin ? new ElementRef(origin) : undefined);
    const barsPositions = positions.map(
      (p) => new RelativeToTopLeftTooltipPosition(p)
    );
    this._position = new HtmlTooltipCdkManagedPosition(barsPositions);
    return this;
  }

  dotsPosition(
    origin: SVGCircleElement,
    positions: Partial<ConnectedPosition>[]
  ): this {
    this.origin(origin ? new ElementRef(origin) : undefined);
    const dotsPositions = positions.map(
      (p) => new RelativeToCenterTooltipPosition(p)
    );
    this._position = new HtmlTooltipCdkManagedPosition(dotsPositions);
    return this;
  }

  geographiesPosition(
    origin: SVGPathElement,
    positions: Partial<ConnectedPosition>[]
  ): this {
    this.origin(origin ? new ElementRef(origin) : undefined);
    const geographiesPositions = positions.map(
      (p) => new RelativeToTopLeftTooltipPosition(p)
    );
    this._position = new HtmlTooltipCdkManagedPosition(geographiesPositions);
    return this;
  }

  linesPosition(positions: Partial<ConnectedPosition>[]): this {
    const linesPositions = positions.map(
      (p) => new RelativeToTopLeftTooltipPosition(p)
    );
    this._position = new HtmlTooltipCdkManagedPosition(linesPositions);
    return this;
  }

  stackedAreaPosition(positions: Partial<ConnectedPosition>[]): this {
    const stackedAreaPositions = positions.map(
      (p) => new RelativeToTopLeftTooltipPosition(p)
    );
    this._position = new HtmlTooltipCdkManagedPosition(stackedAreaPositions);
    return this;
  }

  cdkManagedPosition(positions: ConnectedPosition[]): this {
    this._position = new HtmlTooltipCdkManagedPosition(positions);
    return this;
  }

  offsetFromOriginPosition(): this;
  offsetFromOriginPosition(offset: null): this;
  offsetFromOriginPosition(
    offset: (offset: HtmlTooltipOffsetFromOriginPositionBuilder) => void
  ): this;
  offsetFromOriginPosition(
    offset?: (offset: HtmlTooltipOffsetFromOriginPositionBuilder) => void | null
  ): this {
    if (offset === null) {
      this._position = undefined;
      return this;
    }
    const builder = new HtmlTooltipOffsetFromOriginPositionBuilder();
    offset?.(builder);
    this._position = builder._build();
    return this;
  }

  show(show: boolean): this {
    this._show = show;
    return this;
  }

  getConfig(): HtmlTooltipConfig {
    this.validateBuilder();
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
