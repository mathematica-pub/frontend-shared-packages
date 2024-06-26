const DEFAULT = {
  defaultLabelColor: '#000000',
  display: true,
  noValueFunction: () => 'N/A',
  offset: 4,
  withinBarAlternativeLabelColor: '#ffffff',
};

export class VicBarsLabels<Datum> {
  /**
   * The default label color is used for a label positioned outside of a bar. Additionally, if its contrast ratio with the bar color is higher than that of the withinBarAlternativeLabelColor, it is used for a label positioned within a bar.
   * @default '#000000'
   * @type {string}
   */
  defaultLabelColor: string;
  /**
   * The display property determines whether labels are displayed or not.
   * @default true
   * @type {boolean}
   */
  display: boolean;
  /**
   * The noValueFunction is used to determine the text of the label when the value of the bar is null or undefined.
   * @default (d: Datum) => 'N/A'
   * @type {(d: Datum) => string}
   */
  noValueFunction: (d: Datum) => string;
  /**
   * The distance between the label and the end of the bar.
   * @default 4
   * @type {number}
   */
  offset: number;
  /**
   *  The alternative label color is used for a label positioned within a bar if its contrast ratio with the bar color is higher than that of the defaultLabelColor.
   * @default '#ffffff'
   * @type {string}
   */
  withinBarAlternativeLabelColor: string;

  constructor(options?: Partial<VicBarsLabels<Datum>>) {
    Object.assign(this, DEFAULT, options);
  }
}
