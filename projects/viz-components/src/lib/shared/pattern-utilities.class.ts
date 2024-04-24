import { VicPatternPredicate } from '../data-marks/data-marks.config';

/**
 * @internal
 */
export class PatternUtilities {
  static getPatternFill<Datum>(
    datum: Datum,
    defaultColor: string,
    predicates: VicPatternPredicate<Datum>[]
  ) {
    if (predicates) {
      predicates.forEach((predMapping: VicPatternPredicate<Datum>) => {
        if (predMapping.predicate(datum)) {
          defaultColor = `url(#${predMapping.patternName})`;
        }
      });
    }
    return defaultColor;
  }
}
