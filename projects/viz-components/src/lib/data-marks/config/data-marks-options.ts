export interface DataMarksOptions<Datum> {
  /**
   * An array of data objects to be used to create marks.
   * The objects can be of an type, and can contain any number of properties, including properties that are extraneous to the chart at hand.
   *
   * @default: []
   * Default is []
   */
  data: Datum[];
  mixBlendMode: string;
}
