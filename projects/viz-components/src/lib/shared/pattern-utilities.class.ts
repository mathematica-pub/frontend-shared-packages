import { PatternPredicate } from '../data-marks/data-marks.config';

export class PatternUtilities {
  static getPatternFill(
    datum: any,
    defaultColor: string,
    predicates: PatternPredicate[]
  ) {
    if (predicates) {
      predicates.forEach((predMapping: PatternPredicate) => {
        if (predMapping.predicate(datum)) {
          defaultColor = `url(#${predMapping.patternName})`;
        }
      });
    }
    return defaultColor;
  }
}
