import { AttributeDataDimensionOptions } from '../attribute-data/attribute-data-dimension-options';

export interface NoBinsAttributeDataDimensionOptions<Datum>
  extends AttributeDataDimensionOptions<Datum, number> {
  domain: [number, number];
  formatSpecifier: string;
}
