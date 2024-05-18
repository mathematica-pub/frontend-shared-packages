import { Geometry, MultiPolygon, Polygon } from 'geojson';
import {
  VicBaseDataGeographyConfig,
  VicBaseDataGeographyOptions,
} from './base-data-geographies';
import { VicCategoricalAttributeDataDimension } from './categorical-bins';
import { VicCustomBreaksAttributeDataDimension } from './custom-breaks-bins';
import { VicEqualNumObservationsAttributeDataDimension } from './equal-num-observations-bins';
import { VicEqualValuesAttributeDataDimension } from './equal-value-ranges-bins';
import { VicNoBinsAttributeDataDimension } from './no-bins';

const DEFAULT = {
  attributeData: new VicEqualValuesAttributeDataDimension(),
  nullColor: '#dcdcdc',
  strokeColor: 'dimgray',
  strokeWidth: '1',
};

/**
 * Configuration object for geographies that have attribute data.
 *
 * The generic parameters are the same as those in VicGeographiesConfig.
 */
export interface VicDataGeographiesOptions<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends VicBaseDataGeographyOptions<Datum, TProperties, TGeometry> {
  attributeData:
    | VicCategoricalAttributeDataDimension<Datum>
    | VicNoBinsAttributeDataDimension<Datum>
    | VicEqualValuesAttributeDataDimension<Datum>
    | VicEqualNumObservationsAttributeDataDimension<Datum>
    | VicCustomBreaksAttributeDataDimension<Datum>;
  nullColor: string;
}

export class VicDataGeographies<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends VicBaseDataGeographyConfig<Datum, TProperties, TGeometry> {
  readonly attributeData:
    | VicCategoricalAttributeDataDimension<Datum>
    | VicNoBinsAttributeDataDimension<Datum>
    | VicEqualValuesAttributeDataDimension<Datum>
    | VicEqualNumObservationsAttributeDataDimension<Datum>
    | VicCustomBreaksAttributeDataDimension<Datum>;
  readonly nullColor: string;

  constructor(
    options?: Partial<VicDataGeographiesOptions<Datum, TProperties, TGeometry>>
  ) {
    super();
    Object.assign(this, options);
    this.attributeData = this.attributeData || DEFAULT.attributeData;
    this.nullColor = this.nullColor || DEFAULT.nullColor;
    this.strokeColor = this.strokeColor || DEFAULT.strokeColor;
    this.strokeWidth = this.strokeWidth || DEFAULT.strokeWidth;
  }
}

export function vicDataGeographies<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
>(
  options?: Partial<VicDataGeographiesOptions<Datum, TProperties, TGeometry>>
): VicDataGeographies<Datum, TProperties, TGeometry> {
  return new VicDataGeographies(options);
}
