import { VicAttributeDataDimensionOptions } from '../attribute-data/attribute-data-dimension-options';

export interface VicNoBinsAttributeDataDimensionOptions<Datum>
  extends VicAttributeDataDimensionOptions<Datum, number> {
  domain: [number, number];
  formatSpecifier: string;
}
