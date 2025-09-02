import { safeAssign } from '@hsi/app-dev-kit';
import { SvgTextWrapBuilder } from '../../svg-text-wrap/svg-text-wrap-builder';
import { AxisLabel } from './axis-label';

const DEFAULT = {
  _offset: { x: 0, y: 0 },
  _position: 'middle',
};

export class AxisLabelBuilder {
  protected _anchor: 'start' | 'middle' | 'end';
  protected _offset: {
    x: number;
    y: number;
  };
  protected _position: 'start' | 'middle' | 'end';
  protected _text: string;
  protected textWrapBuilder: SvgTextWrapBuilder;
  protected textWrapFunction: (wrap: SvgTextWrapBuilder) => void;

  constructor() {
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. The [text-anchor](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor) for the axis label.
   *
   * If not provided or if called with null, the anchor will be determined by the position.
   *
   * @default specific to the position
   */
  anchor(value: 'start' | 'middle' | 'end' | null): this {
    if (value === null) {
      this._anchor = undefined;
      return this;
    }
    this._anchor = value;
    return this;
  }

  /**
   * OPTIONAL. The offset for the axis label from the position that would otherwise be created. Allows for fine-tuning the position of the label.
   *
   * Positive y values will move the label down, positive x values will move the label to the right.
   *
   * If not provided or if called with null, labels parallel to the axis will be placed at the far extent of the margin. Labels perpendicular to the axis will be placed at the axis line. The latter will likely need an offset.
   *
   * @default { x: 0, y: 0 }
   */
  offset(offset: null): this;
  offset(offset: { x?: number; y?: number }): this;
  offset(offset: { x?: number; y?: number } | null): this {
    if (offset === null) {
      this._offset = DEFAULT._offset;
      return this;
    }
    this._offset = {
      x: offset.x || 0,
      y: offset.y || 0,
    };
    return this;
  }

  /**
   * OPTIONAL. The position of the axis label relative to the axis.
   *
   * If the axis is horizontal, the options are 'start' is left, 'middle' is center, and 'end' is right.
   *
   * If the axis is vertical, the options are 'start' is top, 'middle' is center, and 'end' is bottom.
   *
   * @default 'middle'
   */
  position(value: 'start' | 'middle' | 'end'): this {
    this._position = value;
    return this;
  }

  /**
   * The text for the axis label.
   */
  text(value: string): this {
    this._text = value;
    return this;
  }

  /**
   * OPTIONAL. Specifies properties for wrapping the text of the label.
   *
   * To unset the wrap, call with null.
   */
  wrap(wrap: null): this;
  wrap(wrap: (wrap: SvgTextWrapBuilder) => void): this;
  wrap(wrap: ((wrap: SvgTextWrapBuilder) => void) | null): this {
    if (wrap === null) {
      this.textWrapFunction = undefined;
      return this;
    }
    this.textWrapFunction = wrap;
    return this;
  }

  /**
   * @internal Not meant to be called by consumers of the library.
   */
  _build(dimension: 'x' | 'y'): AxisLabel {
    if (this.textWrapFunction) this.createTextWrapBuilder(dimension);
    return new AxisLabel({
      anchor: this.getAnchorForDimension(dimension),
      position: this._position,
      offset: this._offset,
      text: this._text,
      wrap: this.textWrapBuilder?.build(),
    });
  }

  private createTextWrapBuilder(dimension: 'x' | 'y'): void {
    this.textWrapBuilder = new SvgTextWrapBuilder();
    const isRotatedYLabel = dimension === 'y' && this._position === 'middle';
    if (isRotatedYLabel) {
      this.textWrapBuilder.maintainXPosition(false);
      this.textWrapBuilder.maintainYPosition(true);
    }
    this.textWrapFunction(this.textWrapBuilder);
  }

  private getAnchorForDimension(
    dimension: 'x' | 'y'
  ): 'start' | 'middle' | 'end' {
    if (this._anchor) return this._anchor;
    switch (this._position) {
      case 'start':
        return dimension === 'x' ? 'start' : 'end';
      case 'middle':
        return 'middle';
      case 'end':
        return 'end';
    }
  }
}
