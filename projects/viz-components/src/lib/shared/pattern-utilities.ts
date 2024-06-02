import { VicFillPattern } from '../data-dimensions/fill-pattern';

/**
 * @internal
 */
export class PatternUtilities {
  static getPatternFill<Datum>(
    datum: Datum,
    defaultColor: string,
    predicates: VicFillPattern<Datum>[]
  ): string {
    if (predicates) {
      predicates.forEach((predMapping: VicFillPattern<Datum>) => {
        if (predMapping.predicate(datum)) {
          defaultColor = `url(#${predMapping.name})`;
        }
      });
    }
    return defaultColor;
  }
}
