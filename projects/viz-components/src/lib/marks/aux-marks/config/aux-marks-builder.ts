const DEFAULT = {
  _mixBlendMode: 'normal',
};

export abstract class VicAuxMarksBuilder<Datum> {
  protected _data: Datum[];
  protected _mixBlendMode: string;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Sets the data that will be used to render the marks for this component.
   *
   * The objects in the array can be of an type, and if an array of objects, the objects can contain any number of properties, including properties that are extraneous to the chart at hand.
   */
  data(data: Datum[]): this {
    this._data = data;
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

  protected validateBuilder(): void {
    return;
  }
}
