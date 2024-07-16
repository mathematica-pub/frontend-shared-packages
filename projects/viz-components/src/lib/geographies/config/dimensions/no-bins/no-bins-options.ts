import { VicAttributeDataDimensionOptions } from '../attribute-data/attribute-data-dimension-options';

export interface VicNoBinsAttributeDataDimensionOptions<Datum>
  extends VicAttributeDataDimensionOptions<Datum, number> {
  /**
   * A format specifier that will be applied to the value of this dimension for display purposes.
   */
  formatSpecifier: string;
}
