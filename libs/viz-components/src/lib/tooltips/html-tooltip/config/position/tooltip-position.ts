import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  OverlayPositionBuilder,
  PositionStrategy,
} from '@angular/cdk/overlay';
import { HtmlTooltipOffsetFromOriginPositionOptions } from './tooltip-position-options';

export abstract class HtmlTooltipPosition {
  type: 'connected' | 'global';
  strategy: GlobalPositionStrategy | FlexibleConnectedPositionStrategy;

  abstract getPositionStrategy(
    origin: Element,
    overlayPositionBuilder: OverlayPositionBuilder,
    document?: Document
  ): PositionStrategy;
}

export class HtmlTooltipCdkManagedPosition extends HtmlTooltipPosition {
  positions: ConnectedPosition[];

  constructor(positions: ConnectedPosition[]) {
    super();
    this.type = 'connected';
    this.positions = positions;
  }

  getPositionStrategy(
    origin: Element,
    overlayPositionBuilder: OverlayPositionBuilder
  ): PositionStrategy {
    return overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions(this.positions);
  }
}

export class HtmlTooltipOffsetFromOriginPosition
  extends HtmlTooltipPosition
  implements HtmlTooltipOffsetFromOriginPositionOptions
{
  offsetY: number;
  offsetX: number;
  tooltipOriginX: 'center';
  tooltipOriginY: 'bottom';

  constructor(options: HtmlTooltipOffsetFromOriginPositionOptions) {
    super();
    this.type = 'global';
    this.tooltipOriginX = 'center';
    this.tooltipOriginY = 'bottom';
    Object.assign(this, options);
  }

  getPositionStrategy(
    origin: Element,
    overlayPositionBuilder: OverlayPositionBuilder,
    document: Document
  ): PositionStrategy {
    const _window = document.defaultView || window;
    const viewport = {
      width: _window.document.body.clientWidth,
      height: _window.document.body.clientHeight,
    };
    const originDims = origin.getBoundingClientRect();
    return overlayPositionBuilder
      .global()
      .top(`${viewport.height - originDims.top - this.offsetY}px`)
      .centerHorizontally(
        `${-2 * (viewport.width / 2 - originDims.left - this.offsetX)}px`
      );
  }
}
