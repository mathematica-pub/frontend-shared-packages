import { VicFillPattern } from '../data-dimensions/categorical/fill-pattern';

/**
 * @internal
 */
export class PatternUtilities {
  static getFill<Datum>(
    datum: Datum,
    defaultColor: string,
    patterns: VicFillPattern<Datum>[]
  ): string {
    if (patterns) {
      patterns.forEach((pattern: VicFillPattern<Datum>) => {
        if (pattern.usePattern(datum)) {
          defaultColor = `url(#${pattern.name})`;
        }
      });
    }
    return defaultColor;
  }
}
