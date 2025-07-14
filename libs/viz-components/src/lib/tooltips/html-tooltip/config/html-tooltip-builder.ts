import { ElementRef, Injectable } from '@angular/core';
import { safeAssign } from '@hsi/app-dev-kit';
import { BaseInteractionOutput } from '../../../events/interaction-output';
import { HtmlTooltipConfig } from './html-tooltip-config';
import { HtmlTooltipCdkManagedPosition } from './position/tooltip-position';
import { HtmlTooltipSizeBuilder } from './size/tooltip-size-builder';

const DEFAULT = {
  _minWidth: 300,
  _applyEventsDisabledClass: true,
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
  }

  /**
   * OPTIONAL. If set to true, the tooltip will have a class that disables pointer events.
   * This is useful when the tooltip should not interfere with user interactions, such as when it is used for informational purposes only.
   *
   * Default is true, meaning the class will be applied.
   *
   * @param apply - Whether to apply the events-disabled class or not.
   */
  applyEventsDisabledClass(apply: boolean): this {
    this._applyEventsDisabledClass = apply;
    return this;
  }

  /**
   * OPTIONAL. Will create a Material CDK-provided backdrop if set to true. Clicking on the backdrop will dismiss the backdrop and emit an event.
   *
   * @param hasBackdrop - Whether to show a backdrop or not.
   */
  hasBackdrop(hasBackdrop: boolean): this {
    this._hasBackdrop = hasBackdrop;
    return this;
  }

  /**
   * OPTIONAL. Sets CSS classes to apply to the tooltip panel.
   *
   * @param panelClass - CSS class name(s) to apply to the tooltip panel.
   */
  panelClass(panelClass: string | string[]): this {
    this._panelClass = panelClass;
    return this;
  }

  /**
   * Sets the origin and position of the tooltip based on the output from a BaseInteractionOutput.
   *
   * @param origin - The origin element reference.
   * @param position - Optional position configuration. If not provided, the default position from the output will be used. Note that the output has several methods to return a position that can be used here.
   */
  positionFromOutput(
    output: BaseInteractionOutput,
    position?: HtmlTooltipCdkManagedPosition
  ): this {
    if (output) {
      this._origin = new ElementRef(output.origin);
      this._position = position || output?.defaultPosition;
    }
    return this;
  }

  /**
   * Sets whether the tooltip should be shown or not.
   *
   * @param show - Whether to show the tooltip or not.
   */
  show(show: boolean): this {
    this._show = show;
    return this;
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
    console.log(
      'validating builder with position',
      this._position,
      this._origin
    );
    if (!this.sizeBuilder) {
      this.initSizeBuilder();
    }
    if (this._show && !this._position) {
      throw new Error('Position must be set using positionFromOutput');
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
