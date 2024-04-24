import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicBaseDataGeographyConfig } from './base-data-geographies';
import { VicCategoricalAttributeDataDimension } from './categorical-bins';
import { VicCustomBreaksAttributeDataDimension } from './custom-breaks-bins';
import { VicEqualNumObservationsAttributeDataDimension } from './equal-num-observations-bins';
import { VicEqualValuesAttributeDataDimension } from './equal-value-ranges-bins';
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
    | VicCategoricalAttributeDataDimension<Datum>
    | VicNoBinsAttributeDataDimensionConfig<Datum>
    | VicEqualValuesAttributeDataDimension<Datum>
    | VicEqualNumObservationsAttributeDataDimension<Datum>
    | VicCustomBreaksAttributeDataDimension<Datum>;
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
