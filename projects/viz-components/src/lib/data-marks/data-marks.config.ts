export class DataMarksConfig<T> {
  /**
   * An array of data objects to be used to create marks.
   * The objects can be of an type, and can contain any number of properties, including properties that are extraneous to the chart at hand.
   *
   * @default: []
   * Default is []
   */
  data: T[];
  /**
   * A blend mode applied to the primary svg g elements in various marks components.
   *
   * @default: 'normal'
   * Default is 'normal'
   */
  mixBlendMode: string;

  constructor(init?: Partial<DataMarksConfig>) {
    this.mixBlendMode = 'normal';
    this.data = [];
    Object.assign(this, init);
  }
}

export interface PatternPredicate {
  patternName: string;
  predicate: (d: any) => boolean;
}
