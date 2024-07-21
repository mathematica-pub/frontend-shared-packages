import { ConnectedPosition } from '@angular/cdk/overlay';
import { ElementRef, Injectable } from '@angular/core';
import { HtmlTooltipConfig } from './html-tooltip';
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
export class VicHtmlTooltipBuilder {
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
    Object.assign(this, DEFAULT);
    this.sizeBuilder = new HtmlTooltipSizeBuilder();
    this._applyEventsDisabledClass = false;
  }

  setSize(setProperties: (size: HtmlTooltipSizeBuilder) => void): this {
    this.initSizeBuilder();
    setProperties?.(this.sizeBuilder);
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

  applyEventsDisabledClass(): this {
    this._applyEventsDisabledClass = true;
    return this;
  }

  panelClass(panelClass: string | string[]): this {
    this._panelClass = panelClass;
    return this;
  }

  cdkManagedPosition(positions: ConnectedPosition[]): this {
    this._position = new HtmlTooltipCdkManagedPosition(positions);
    return this;
  }

  createOffsetFromOriginPosition(
    setProperties?: (
      position: HtmlTooltipOffsetFromOriginPositionBuilder
    ) => void
  ): this {
    const builder = new HtmlTooltipOffsetFromOriginPositionBuilder();
    setProperties?.(builder);
    this._position = builder.build();
    return this;
  }

  show(show: boolean): this {
    this._show = show;
    return this;
  }

  build(): HtmlTooltipConfig {
    this.validateBuilder();
    return new HtmlTooltipConfig({
      hasBackdrop: this._hasBackdrop,
      panelClass: this.getPanelClasses(),
      origin: this._origin,
      position: this._position,
      show: this._show,
      size: this.sizeBuilder.build(),
    });
  }

  validateBuilder(): void {
    if (!this.sizeBuilder) {
      this.initSizeBuilder();
    }
    if (!this._position) {
      throw new Error('Position must be set');
    }
  }

  getPanelClasses(): string[] {
    const userClasses = this._panelClass ? [this._panelClass].flat() : [];
    const panelClasses = ['vic-html-tooltip-overlay', ...userClasses].flat();
    if (this._applyEventsDisabledClass) {
      panelClasses.push('events-disabled');
    }
    return panelClasses;
  }
}
