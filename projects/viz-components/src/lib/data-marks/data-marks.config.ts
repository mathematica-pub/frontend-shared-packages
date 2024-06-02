export interface VicDataOptions<Datum> {
  /**
   * An array of data objects to be used to create marks.
   * The objects can be of an type, and can contain any number of properties, including properties that are extraneous to the chart at hand.
   *
   * @default: []
   * Default is []
   */
  data: Datum[];
  /**
   * A blend mode applied to the primary svg g elements in various marks components.
   *
   * @default: 'normal'
   * Default is 'normal'
   */
  mixBlendMode: string;
}

export abstract class VicDataConfig<Datum> implements VicDataOptions<Datum> {
  readonly data: Datum[];
  readonly mixBlendMode: string;
  protected abstract initPropertiesFromData(): void;

  constructor() {
    this.mixBlendMode = 'normal';
  }
}
