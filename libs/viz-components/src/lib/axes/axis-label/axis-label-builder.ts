import { SvgTextWrapBuilder } from '../../svg-text-wrap/svg-text-wrap-builder';
import { AxisLabel } from './axis-label-config';

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
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. The [text-anchor](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor) for the axis label.
   *
   * If not provided, the anchor will be determined by the position.
   *
   * @default specific to the position
   */
  anchor(value: 'start' | 'middle' | 'end'): this {
    this._anchor = value;
    return this;
  }

  /**
   * The offset for the axis label from the position that would otherwise be created. Allows for fine-tuning the position of the label.
   *
   * Positive y values will move the label down, positive x values will move the label to the right.
   *
   * If not provided, labels parallel to the axis will be placed at the far extent of the margin. Labels perpendicular to the axis will be placed at the axis line. The latter will likely need an offset.
   *
   * @default { x: 0, y: 0 }
   */
  offset(value: { x?: number; y?: number }): this {
    this._offset = {
      x: value.x || 0,
      y: value.y || 0,
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
   * Specifies properties for wrapping the text of the label.
   */
  wrap(setProperties: (wrap: SvgTextWrapBuilder) => void): this {
    this.textWrapFunction = setProperties;
    return this;
  }

  /**
   * @internal Not meant to be called by consumers of the library.
   */
  build(dimension: 'x' | 'y'): AxisLabel {
    if (this.textWrapFunction) this.createTextWrapBuilder(dimension);
    return new AxisLabel({
      anchor: this.getAnchorForDimension(dimension),
      position: this._position,
      offset: this._offset,
      text: this._text,
      wrap: this.textWrapBuilder?.build(),
    });
  }

  createTextWrapBuilder(dimension: 'x' | 'y'): void {
    const isRotatedYLabel = dimension === 'y' && this._position === 'middle';
    this.textWrapBuilder = new SvgTextWrapBuilder();
    this.textWrapBuilder.maintainXPosition(isRotatedYLabel);
    this.textWrapBuilder.maintainYPosition(isRotatedYLabel);
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
