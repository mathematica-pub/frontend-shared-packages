import { QuantitativeRulesLabels } from './quantitative-rules-label';

const DEFAULT = {
  _display: () => true,
  _dominantBaseline: 'middle',
};

export class RulesLabelsBuilder<Datum> {
  private _color: (d: Datum) => string;
  private _display: (d: Datum) => boolean;
  private _dominantBaseline:
    | 'middle'
    | 'text-after-edge'
    | 'text-before-edge'
    | 'central'
    | 'auto'
    | 'hanging'
    | 'ideographic'
    | 'alphabetic';
  private _value: (d: Datum) => string;
  private _offset: number;
  private _position: (start: number, end: number, d: Datum) => number;
  private _textAnchor: 'start' | 'middle' | 'end';

  constructor() {
    Object.assign(this, DEFAULT);
    this._value = (d: Datum) => `${d}`;
  }

  color(color: string | ((d: Datum) => string)) {
    this._color = typeof color === 'string' ? () => color : color;
    return this;
  }

  display(display: boolean | ((d: Datum) => boolean)) {
    this._display = typeof display === 'boolean' ? () => display : display;
    return this;
  }

  dominantBaseline(
    dominantBaseline:
      | 'middle'
      | 'text-after-edge'
      | 'text-before-edge'
      | 'central'
      | 'auto'
      | 'hanging'
      | 'ideographic'
      | 'alphabetic'
  ) {
    this._dominantBaseline = dominantBaseline;
    return this;
  }

  value(value: (d: Datum) => string) {
    this._value = value;
    return this;
  }

  offset(offset: number) {
    this._offset = offset;
    return this;
  }

  position(position: (start: number, end: number, d: Datum) => number) {
    this._position = position;
    return this;
  }

  textAnchor(textAnchor: 'start' | 'middle' | 'end') {
    this._textAnchor = textAnchor;
    return this;
  }

  _build(): QuantitativeRulesLabels<Datum> {
    return new QuantitativeRulesLabels<Datum>({
      color: this._color,
      display: this._display,
      dominantBaseline: this._dominantBaseline,
      value: this._value,
      offset: this._offset,
      position: this._position,
      textAnchor: this._textAnchor,
    });
  }

  validateBuilder(
    orientation: 'horizontal' | 'vertical',
    lineColor: (d: Datum) => string
  ): void {
    if (!this._color) {
      this._color = lineColor;
    }
    if (!this._offset) {
      if (orientation === 'horizontal') {
        this._offset = -12;
      } else {
        this._offset = 0;
      }
    }
    if (!this._position) {
      if (orientation === 'horizontal') {
        this._position = (start: number, end: number) => end - 4;
      } else {
        this._position = (start: number, end: number) => end - 12;
      }
    }
    if (!this._textAnchor) {
      this._textAnchor = orientation === 'horizontal' ? 'end' : 'middle';
    }
  }
}
