import { BarsLabels } from './bars-labels';

const DEFAULT = {
  _color: {
    default: '#000000',
    withinBarAlternative: '#ffffff',
  },
  _display: true,
  _noValueFunction: () => 'N/A',
  _offset: 4,
};

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
   */
  color(color: { default: string; withinBarAlternative: string }): this {
    this._color = color;
    return this;
  }

  /**
   * Sets whether labels are displayed or not. Labels will be created but not displayed if this is set to false.
   *
   * A user may want to set this to false if they want labels to display on hover, for example.
   *
   * @default true
   */
  display(display: boolean): this {
    this._display = display;
    return this;
  }

  /**
   * Sets the function to set the text of the label when the value of the bar is null or undefined.
   *
   * If called with null, the default function is used.
   *
   * @default (d: Datum) => 'N/A'
   */
  noValueFunction(noValueFunction: null): this;
  noValueFunction(noValueFunction: (d: Datum) => string): this;
  noValueFunction(noValueFunction: ((d: Datum) => string) | null): this {
    if (noValueFunction === null) {
      this._noValueFunction = DEFAULT._noValueFunction;
      return this;
    }
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

  /**
   * @internal
   * This function is for internal use only and should never be called by the user.
   */
  _build(): BarsLabels<Datum> {
    return new BarsLabels({
      color: this._color,
      display: this._display,
      noValueFunction: this._noValueFunction,
      offset: this._offset,
    });
  }
}
