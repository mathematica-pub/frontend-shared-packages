import { AbstractConstructor } from '../core/common-behaviors/constructor';
import { PatternPredicate } from '../data-marks/data-marks.config';

export function mixinPatternFill<T extends AbstractConstructor<any>>(Base: T) {
  abstract class Mixin extends Base {
    getPatternFill(
      datum: any,
      defaultColor: string,
      predicates: PatternPredicate[]
    ): string {
      if (predicates) {
        predicates.forEach(
          (predMapping: PatternPredicate) => {
            if (predMapping.predicate(datum)) {
              defaultColor = `url(#${predMapping.patternName})`;
            }
          }
        );
      }
      return defaultColor;
    }
  }

  return Mixin;
}
