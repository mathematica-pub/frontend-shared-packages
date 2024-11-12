import { FillDef } from '../../fill-defs/fill-def';

/**
 * @internal
 */
export class FillUtilities {
  static getFill<Datum>(
    datum: Datum,
    defaultColor: string,
    patterns: FillDef<Datum>[]
  ): string {
    if (patterns) {
      patterns.forEach((pattern: FillDef<Datum>) => {
        if (pattern.useDef(datum)) {
          defaultColor = `url(#${pattern.name})`;
        }
      });
    }
    return defaultColor;
  }
}
