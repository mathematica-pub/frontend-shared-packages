import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicBaseDataGeographyConfig } from './base-data-geographies';
import { VicCategoricalAttributeDataDimension } from './categorical-bins';
import { VicCustomBreaksAttributeDataDimension } from './custom-breaks-bins';
import { VicEqualNumObservationsAttributeDataDimension } from './equal-num-observations-bins';
import { VicEqualValuesAttributeDataDimension } from './equal-value-ranges-bins';
import { VicNoBinsAttributeDataDimension } from './no-bins';

/**
 * Configuration object for geographies that have attribute data.
 *
 * The generic parameters are the same as those in VicGeographiesConfig.
 */
export class VicDataGeographies<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends VicBaseDataGeographyConfig<Datum, TProperties, TGeometry> {
  attributeData:
    | VicCategoricalAttributeDataDimension<Datum>
    | VicNoBinsAttributeDataDimension<Datum>
    | VicEqualValuesAttributeDataDimension<Datum>
    | VicEqualNumObservationsAttributeDataDimension<Datum>
    | VicCustomBreaksAttributeDataDimension<Datum>;
  nullColor: string;

  constructor(
    init?: Partial<VicDataGeographies<Datum, TProperties, TGeometry>>
  ) {
    super();
    this.nullColor = '#dcdcdc';
    this.strokeColor = 'dimgray';
    this.strokeWidth = '1';
    Object.assign(this, init);
  }
}
