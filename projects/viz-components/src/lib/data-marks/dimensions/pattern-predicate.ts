export interface VicPatternPredicate<Datum> {
  patternName: string;
  predicate: (d: Datum) => boolean;
}
