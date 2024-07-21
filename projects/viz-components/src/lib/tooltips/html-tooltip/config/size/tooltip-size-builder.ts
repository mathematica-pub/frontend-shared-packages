import { HtmlTooltipSize } from './tooltip-size';

export class HtmlTooltipSizeBuilder {
  _width: number | string;
  _height: number | string;
  _minWidth: number | string;
  _minHeight: number | string;
  _maxWidth: number | string;
  _maxHeight: number | string;

  width(width: number | string) {
    this._width = width;
    return this;
  }

  height(height: number | string) {
    this._height = height;
    return this;
  }

  minWidth(minWidth: number | string) {
    this._minWidth = minWidth;
    return this;
  }

  minHeight(minHeight: number | string) {
    this._minHeight = minHeight;
    return this;
  }

  maxWidth(maxWidth: number | string) {
    this._maxWidth = maxWidth;
    return this;
  }

  maxHeight(maxHeight: number | string) {
    this._maxHeight = maxHeight;
    return this;
  }

  _build(): HtmlTooltipSize {
    return new HtmlTooltipSize({
      width: this._width,
      height: this._height,
      minWidth: this._minWidth,
      minHeight: this._minHeight,
      maxWidth: this._maxWidth,
      maxHeight: this._maxHeight,
    });
  }
}
