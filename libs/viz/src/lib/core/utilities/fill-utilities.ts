import { FillDefinition } from '../../fill-definitions/fill-definitions';

/**
 * @internal
 */
export class FillUtilities {
  static getFill<Datum>(
    datum: Datum,
    defaultColor: string,
    patterns: FillDefinition<Datum>[]
  ): string {
    if (patterns) {
      patterns.forEach((pattern: FillDefinition<Datum>) => {
        if (pattern.shouldApply(datum)) {
          defaultColor = `url(#${pattern.defId})`;
        }
      });
    }
    return defaultColor;
  }
}
