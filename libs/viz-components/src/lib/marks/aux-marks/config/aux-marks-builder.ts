const DEFAULT = {
  _class: () => '',
  _mixBlendMode: 'normal',
};

export abstract class VicAuxMarksBuilder<Datum> {
  protected _mixBlendMode: string;
  protected _class: (d: Datum) => string;

  constructor() {
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Provides a class on the SVG element that correspends to a single datum. If a datum creates multiple SVG elements -- for example, a rect and a label, the class will be applied on the parent SVGGElement.
   *
   * IF the chart does not have SVG elements that correspond to a single datum, this class will be placed on the SVG element that represents a collection of data, for example, a area in a stacked area chart, or a line in a line chart. In this case the datum passed to the callback function will be the first datum in the collection.
   *
   * Note that if the resultant string has spaces in the name, multiple classes will be applied. For example, if the class is 'North Carolina', the element will have the classes 'North' and 'Carolina'.
   */
  class(value: null): this;
  class(value: string): this;
  class(value: (d: Datum) => string): this;
  class(value: ((d: Datum) => string) | string | null): this {
    if (value === null) {
      this._class = DEFAULT._class;
      return this;
    }
    if (typeof value === 'string') {
      this._class = () => value;
      return this;
    }
    this._class = value;
    return this;
  }

  /**
   * Sets the mix-blend-mode of the marks.
   *
   * @default 'normal'
   */
  mixBlendMode(mixBlendMode: string): this {
    this._mixBlendMode = mixBlendMode;
    return this;
  }
}
