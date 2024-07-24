import { FillPattern } from '../../data-dimensions/categorical/fill-pattern';

/**
 * @internal
 */
export class PatternUtilities {
  static getFill<Datum>(
    datum: Datum,
    defaultColor: string,
    patterns: FillPattern<Datum>[]
  ): string {
    if (patterns) {
      patterns.forEach((pattern: FillPattern<Datum>) => {
        if (pattern.usePattern(datum)) {
          defaultColor = `url(#${pattern.name})`;
        }
      });
    }
    return defaultColor;
  }
}
