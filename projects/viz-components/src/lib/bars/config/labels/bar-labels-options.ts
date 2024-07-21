export interface BarsLabelsOptions<Datum> {
  color: { default: string; withinBarAlternative: string };
  display: boolean;
  noValueFunction: (d: Datum) => string;
  offset: number;
}
