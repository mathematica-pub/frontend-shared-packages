import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicBaseDataGeographyConfig } from '../geographies.config';
import { VicCategoricalAttributeDataDimensionConfig } from './categorical-bins';
import { VicCustomBreaksAttributeDataDimensionConfig } from './custom-breaks-bins';
import { VicEqualNumbersAttributeDataDimensionConfig } from './equal-num-observations-bins';
import { VicEqualValuesAttributeDataDimensionConfig } from './equal-value-ranges-bins';
import { VicNoBinsAttributeDataDimensionConfig } from './no-bins';

/**
 * Configuration object for geographies that have attribute data.
 *
 * The generic parameters are the same as those in VicGeographiesConfig.
 */
export class VicDataGeographyConfig<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends VicBaseDataGeographyConfig<Datum, TProperties, TGeometry> {
  attributeDataConfig:
    | VicCategoricalAttributeDataDimensionConfig<Datum>
    | VicNoBinsAttributeDataDimensionConfig<Datum>
    | VicEqualValuesAttributeDataDimensionConfig<Datum>
    | VicEqualNumbersAttributeDataDimensionConfig<Datum>
    | VicCustomBreaksAttributeDataDimensionConfig<Datum>;
  nullColor: string;

  constructor(
    init?: Partial<VicDataGeographyConfig<Datum, TProperties, TGeometry>>
  ) {
    super();
    this.nullColor = '#dcdcdc';
    this.strokeColor = 'dimgray';
    this.strokeWidth = '1';
    Object.assign(this, init);
  }
}
