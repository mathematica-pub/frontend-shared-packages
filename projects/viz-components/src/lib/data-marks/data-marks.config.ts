export class VicDataMarksConfig {
  /**
   * An array of data objects to be used to create marks.
   * The objects can be of an type, and can contain any number of properties, including properties that are extraneous to the chart at hand.
   *
   * @default: []
   * Default is []
   */
  data: any[];
  /**
   * A blend mode applied to the primary svg g elements in various marks components.
   *
   * @default: 'normal'
   * Default is 'normal'
   */
  mixBlendMode: string;

  constructor(init?: Partial<VicDataMarksConfig>) {
    this.mixBlendMode = 'normal';
    this.data = [];
    Object.assign(this, init);
  }
}

export interface VicPatternPredicate {
  patternName: string;
  predicate: (d: any) => boolean;
}
