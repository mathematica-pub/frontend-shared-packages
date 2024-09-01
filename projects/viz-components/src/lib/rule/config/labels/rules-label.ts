import { RulesLabelsOptions } from './rules-label-options';

export class RulesLabels<Datum> implements RulesLabelsOptions<Datum> {
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

  constructor(options: RulesLabelsOptions<Datum>) {
    Object.assign(this, options);
  }
}
