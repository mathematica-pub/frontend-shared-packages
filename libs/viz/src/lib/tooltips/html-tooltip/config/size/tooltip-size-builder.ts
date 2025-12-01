import { HtmlTooltipSize } from './tooltip-size';

export class HtmlTooltipSizeBuilder {
  _width: number | string;
  _height: number | string;
  _minWidth: number | string;
  _minHeight: number | string;
  _maxWidth: number | string;
  _maxHeight: number | string;

  width(width: number | string | null) {
    if (width === null) {
      this._width = undefined;
      return this;
    }
    this._width = width;
    return this;
  }

  height(height: number | string | null) {
    if (height === null) {
      this._height = undefined;
      return this;
    }
    this._height = height;
    return this;
  }

  minWidth(minWidth: number | string | null) {
    if (minWidth === null) {
      this._minWidth = undefined;
      return this;
    }
    this._minWidth = minWidth;
    return this;
  }

  minHeight(minHeight: number | string | null) {
    if (minHeight === null) {
      this._minHeight = undefined;
      return this;
    }
    this._minHeight = minHeight;
    return this;
  }

  maxWidth(maxWidth: number | string | null) {
    if (maxWidth === null) {
      this._maxWidth = undefined;
      return this;
    }
    this._maxWidth = maxWidth;
    return this;
  }

  maxHeight(maxHeight: number | string | null) {
    if (maxHeight === null) {
      this._maxHeight = undefined;
      return this;
    }
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
