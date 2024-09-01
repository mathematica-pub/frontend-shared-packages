export interface RulesLabelsOptions<Datum> {
  color: (d: Datum) => string;
  display: (d: Datum) => boolean;
  dominantBaseline:
    | 'auto'
    | 'middle'
    | 'central'
    | 'text-before-edge'
    | 'text-after-edge'
    | 'hanging'
    | 'ideographic'
    | 'alphabetic';
  value: (d: Datum) => string;
  offset: number;
  position: (start: number, end: number, d: Datum) => number;
  textAnchor: 'start' | 'middle' | 'end';
}
