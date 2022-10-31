import { AbstractConstructor } from "../core/common-behaviors/constructor";

export function mixinPatternFill<T extends AbstractConstructor<any>>(
  Base: T
) {
  abstract class Mixin extends Base {

    getPatternFill(datum: any, defaultColor: string, predicates: Map<string, (d: any) => boolean>): string {
        if (predicates) {
            predicates.forEach(
                (predicate: (d: any) => boolean, patternId: string) => {
                    if (predicate(datum)) {
                        defaultColor = `url(#${patternId})`;
                    }
                }
            );
        }
        return defaultColor;
    }
  }

  return Mixin;
}
