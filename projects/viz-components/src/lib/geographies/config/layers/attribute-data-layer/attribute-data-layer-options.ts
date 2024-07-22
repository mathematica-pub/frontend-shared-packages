import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { GeographiesLayerOptions } from '../geographies-layer/geographies-layer-options';
import { GeographiesLabels } from '../labels/geographies-labels';
import { CategoricalBinsAttributeDataDimension } from './dimensions/categorical-bins/categorical-bins';
import { CustomBreaksBinsAttributeDataDimension } from './dimensions/custom-breaks/custom-breaks-bins';
import { EqualFrequenciesAttributeDataDimension } from './dimensions/equal-frequencies-bins/equal-frequencies-bins';
import { EqualValueRangesAttributeDataDimension } from './dimensions/equal-value-ranges-bins/equal-value-ranges-bins';
import { NoBinsAttributeDataDimension } from './dimensions/no-bins/no-bins';

export interface GeographiesAttributeDataLayerOptions<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends GeographiesLayerOptions<TProperties, TGeometry> {
  attributeDimension:
    | CategoricalBinsAttributeDataDimension<Datum>
    | NoBinsAttributeDataDimension<Datum>
    | EqualValueRangesAttributeDataDimension<Datum>
    | EqualFrequenciesAttributeDataDimension<Datum>
    | CustomBreaksBinsAttributeDataDimension<Datum>;
  data: Datum[];
  geographyIndexAccessor: (d: Datum) => string;
  labels: GeographiesLabels<Datum, TProperties, TGeometry>;
}
