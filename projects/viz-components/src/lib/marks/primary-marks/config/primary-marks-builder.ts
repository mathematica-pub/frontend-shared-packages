const DEFAULT = {
  _mixBlendMode: 'normal',
};

export abstract class PrimaryMarksBuilder<Datum> {
  protected _data: Datum[];
  protected _mixBlendMode: string;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * REQUIRED. Sets the data that will be used to render the marks for this component
   *
   * If no dimension domain overrides are provided, **this primary-marks data will also create the domain of the scales used on the entire chart**.
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

  protected validateBuilder(componentName: string): void {
    if (!this._data) {
      throw new Error(
        `${componentName} Builder: data is required. Use the 'data' method to set the data.`
      );
    }
  }
}
