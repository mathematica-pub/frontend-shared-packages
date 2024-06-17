import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicDimensionCategorical } from '../../../data-dimensions/categorical/categorical';
import { VicGeographiesFeature } from '../../geographies-feature';
import { VicGeographiesLabels } from '../geographies-labels';
import {
  VicGeographiesLayer,
  VicGeographiesLayerOptions,
} from './geographies-layer';

const DEFAULT = {
  strokeColor: 'dimgray',
  strokeWidth: '1',
  fill: 'none',
};

export interface VicGeographiesNoDataLayerOptions<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
  TCategoricalValue extends string = string
> extends VicGeographiesLayerOptions<TProperties, TGeometry> {
  categorical: VicDimensionCategorical<
    VicGeographiesFeature<TProperties, TGeometry>,
    TCategoricalValue
  >;
  labels: VicGeographiesLabels<
    VicGeographiesFeature<TProperties, TGeometry>,
    TProperties,
    TGeometry
  >;
}

export class VicGeographiesNoDataLayer<
    TProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon,
    TCategoricalValue extends string = string
  >
  extends VicGeographiesLayer<
    VicGeographiesFeature<TProperties, TGeometry>,
    TProperties,
    TGeometry
  >
  implements
    VicGeographiesNoDataLayerOptions<TProperties, TGeometry, TCategoricalValue>
{
  override readonly hasAttributeData: false;
  readonly categorical: VicDimensionCategorical<
    VicGeographiesFeature<TProperties, TGeometry>,
    TCategoricalValue
  >;
  override labels: VicGeographiesLabels<
    VicGeographiesFeature<TProperties, TGeometry>,
    TProperties,
    TGeometry
  >;

  constructor(
    options?: Partial<
      VicGeographiesNoDataLayerOptions<
        TProperties,
        TGeometry,
        TCategoricalValue
      >
    >
  ) {
    super();
    Object.assign(this, DEFAULT);
    Object.assign(this, options);
    this.hasAttributeData = false;
  }
}
