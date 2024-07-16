import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicCategoricalAttributeDataDimension } from '../../dimensions/categorical-bins/categorical-bins';
import { VicCustomBreaksAttributeDataDimension } from '../../dimensions/custom-breaks/custom-breaks-bins';
import { VicEqualFrequenciesAttributeDataDimension } from '../../dimensions/equal-frequencies-bins/equal-frequencies-bins';
import { VicEqualValueRangesAttributeDataDimension } from '../../dimensions/equal-value-ranges-bins/equal-value-ranges-bins';
import { VicNoBinsAttributeDataDimension } from '../../dimensions/no-bins/no-bins';
import { GeographiesLayerOptions } from '../geographies-layer/geographies-layer-options';
import { VicGeographiesLabels } from '../labels/geographies-labels';

export interface VicGeographiesAttributeDataLayerOptions<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends GeographiesLayerOptions<TProperties, TGeometry> {
  attributeDimension:
    | VicCategoricalAttributeDataDimension<Datum>
    | VicNoBinsAttributeDataDimension<Datum>
    | VicEqualValueRangesAttributeDataDimension<Datum>
    | VicEqualFrequenciesAttributeDataDimension<Datum>
    | VicCustomBreaksAttributeDataDimension<Datum>;
  data: Datum[];
  geographyIndexAccessor: (d: Datum) => string;
  labels: VicGeographiesLabels<Datum, TProperties, TGeometry>;
}
