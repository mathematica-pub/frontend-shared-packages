export interface VicFillPattern<Datum> {
  name: string;
  predicate: (d: Datum) => boolean;
}
