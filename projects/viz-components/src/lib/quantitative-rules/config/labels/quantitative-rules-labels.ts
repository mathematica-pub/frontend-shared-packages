import { QuantitativeRulesLabelsOptions } from './quantitative-rules-labels-options';

export class QuantitativeRulesLabels<Datum>
  implements QuantitativeRulesLabelsOptions<Datum>
{
  color: (d: Datum) => string;
  display: (d: Datum) => boolean;
  dominantBaseline:
    | 'middle'
    | 'text-after-edge'
    | 'text-before-edge'
    | 'central'
    | 'auto'
    | 'hanging'
    | 'ideographic'
    | 'alphabetic';
  value: (d: Datum) => string;
  offset: number;
  position: (start: number, end: number, d: Datum) => number;
  textAnchor: 'start' | 'middle' | 'end';

  constructor(options: QuantitativeRulesLabelsOptions<Datum>) {
    Object.assign(this, options);
  }
}
