import { Geometry } from 'geojson';
import { VicPatternPredicate } from '../data-marks/data-marks.config';
import { VicGeographiesFeature } from '../geographies/geographies';
import { VicGeographyNoDataPatternPredicate } from '../geographies/geographies.config';

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

  // Currently only used for NoDataGeographies -- these functions
  // are identical, the predicates just take different types
  // a future PR could maybe clean this up / consolidate it
  static getNoDataGeographiesPatternFill<P, G extends Geometry>(
    geography: VicGeographiesFeature<P, G>,
    defaultColor: string,
    predicates: VicGeographyNoDataPatternPredicate<P, G>[]
  ) {
    if (predicates) {
      predicates.forEach(
        (predMapping: VicGeographyNoDataPatternPredicate<P, G>) => {
          if (predMapping.predicate(geography)) {
            defaultColor = `url(#${predMapping.patternName})`;
          }
        }
      );
    }
    return defaultColor;
  }
}
