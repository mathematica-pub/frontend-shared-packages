import { VicPatternPredicate } from '../data-marks/data-marks.config';

/**
 * @internal
 */
export class PatternUtilities {
  static getPatternFill(
    datum: any,
    defaultColor: string,
    predicates: VicPatternPredicate[]
  ) {
    if (predicates) {
      predicates.forEach((predMapping: VicPatternPredicate) => {
        if (predMapping.predicate(datum)) {
          defaultColor = `url(#${predMapping.patternName})`;
        }
      });
    }
    return defaultColor;
  }
}
