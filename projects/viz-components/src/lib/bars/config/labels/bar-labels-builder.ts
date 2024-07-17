import { Injectable } from '@angular/core';
import { VicBarsLabels } from './bars-labels';

const DEFAULT = {
  _color: {
    default: '#000000',
    withinBarAlternative: '#ffffff',
  },
  _display: true,
  _noValueFunction: () => 'N/A',
  _offset: 4,
};

@Injectable()
export class BarsLabelsBuilder<Datum> {
  private _color: { default: string; withinBarAlternative: string };
  private _display: boolean;
  private _noValueFunction: (d: Datum) => string;
  private _offset: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   *
   * Sets colors for the labels.
   *
   * The default label color is used for a label positioned outside of a bar. Additionally, if its contrast ratio with the bar color is higher than that of the withinBarAlternative color, it is used for a label positioned within a bar. Otherwise the withinBarAlternative color is used.
   *
   * @default { default: '#000000', withinBarAlternative: '#ffffff' }
   *
   */
  color(color: { default: string; withinBarAlternative: string }): this {
    this._color = color;
    return this;
  }

  /**
   * Sets whether labels are displayed or not.
   *
   * @default true
   */
  display(display: boolean): this {
    this._display = display;
    return this;
  }

  /**
   * Sets the noValueFunction to determine the text of the label when the value of the bar is null or undefined.
   *
   * @default (d: Datum) => 'N/A'
   */
  noValueFunction(noValueFunction: (d: Datum) => string): this {
    this._noValueFunction = noValueFunction;
    return this;
  }

  /**
   * Sets the distance between the label and the end of the bar.
   *
   * @default 4
   */
  offset(offset: number): this {
    this._offset = offset;
    return this;
  }

  build(): VicBarsLabels<Datum> {
    return new VicBarsLabels({
      color: this._color,
      display: this._display,
      noValueFunction: this._noValueFunction,
      offset: this._offset,
    });
  }
}
