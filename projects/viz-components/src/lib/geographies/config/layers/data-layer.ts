import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicCategoricalAttributeDataDimension } from '../dimensions/categorical-bins';
import { VicCustomBreaksAttributeDataDimension } from '../dimensions/custom-breaks-bins';
import { VicEqualNumObservationsAttributeDataDimension } from '../dimensions/equal-num-observations-bins';
import { VicEqualValuesAttributeDataDimension } from '../dimensions/equal-value-ranges-bins';
import { VicNoBinsAttributeDataDimension } from '../dimensions/no-bins';
import { VicGeographiesLabels } from './geographies-labels';
import { GeographiesLayer, GeographiesLayerOptions } from './geographies-layer';

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
export interface VicGeographiesDataLayerOptions<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends GeographiesLayerOptions<TProperties, TGeometry> {
  attributeData:
    | VicCategoricalAttributeDataDimension<Datum>
    | VicNoBinsAttributeDataDimension<Datum>
    | VicEqualValuesAttributeDataDimension<Datum>
    | VicEqualNumObservationsAttributeDataDimension<Datum>
    | VicCustomBreaksAttributeDataDimension<Datum>;
  nullColor: string;
  /**
   * VicGeographyLabelConfig that define the labels to be shown.
   * If not defined, no labels will be drawn.
   */
  labels: VicGeographiesLabels<Datum, TProperties, TGeometry>;
}

export class VicGeographiesDataLayer<
    Datum,
    TProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon
  >
  extends GeographiesLayer<Datum, TProperties, TGeometry>
  implements VicGeographiesDataLayerOptions<Datum, TProperties, TGeometry>
{
  readonly attributeData:
    | VicCategoricalAttributeDataDimension<Datum>
    | VicNoBinsAttributeDataDimension<Datum>
    | VicEqualValuesAttributeDataDimension<Datum>
    | VicEqualNumObservationsAttributeDataDimension<Datum>
    | VicCustomBreaksAttributeDataDimension<Datum>;
  override readonly hasAttributeData: true;
  readonly nullColor: string;
  override labels: VicGeographiesLabels<Datum, TProperties, TGeometry>;

  constructor(
    options?: Partial<
      VicGeographiesDataLayerOptions<Datum, TProperties, TGeometry>
    >
  ) {
    super();
    Object.assign(this, options);
    this.attributeData = this.attributeData || DEFAULT.attributeData;
    this.nullColor = this.nullColor || DEFAULT.nullColor;
    this.strokeColor = this.strokeColor || DEFAULT.strokeColor;
    this.strokeWidth = this.strokeWidth || DEFAULT.strokeWidth;
    this.class = '.vic-data-geographies ' + this.class;
    this.hasAttributeData = true;
  }
}
