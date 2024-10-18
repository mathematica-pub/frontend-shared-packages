import { HtmlTooltipOffsetFromOriginPosition } from './tooltip-position';

const DEFAULT = {
  _offsetX: 0,
  _offsetY: 0,
};

export class HtmlTooltipOffsetFromOriginPositionBuilder {
  private _offsetX: number;
  private _offsetY: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * The offset in the X direction.
   *
   * @default 0
   */
  offsetX(offsetX: number) {
    this._offsetX = offsetX;
    return this;
  }

  /**
   * The offset in the Y direction.
   *
   * @default 0
   */
  offsetY(offsetY: number) {
    this._offsetY = offsetY;
    return this;
  }

  _build(): HtmlTooltipOffsetFromOriginPosition {
    return new HtmlTooltipOffsetFromOriginPosition({
      offsetX: this._offsetX,
      offsetY: this._offsetY,
    });
  }
}
