import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicCategoricalDimension } from '../../../data-dimensions/categorical-dimension';
import { VicGeographiesFeature } from '../../geographies-feature';
import { VicGeographiesLabels } from '../geographies-labels';
import {
  VicBaseDataGeographyConfig,
  VicBaseDataGeographyOptions,
} from './base-data-geographies';

const DEFAULT = {
  strokeColor: 'dimgray',
  strokeWidth: '1',
  fill: 'none',
};

export interface VicNoDataGeographiesOptions<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
  TCategoricalValue extends string = string
> extends VicBaseDataGeographyOptions<TProperties, TGeometry> {
  categorical: VicCategoricalDimension<
    VicGeographiesFeature<TProperties, TGeometry>,
    TCategoricalValue
  >;
  labels: VicGeographiesLabels<
    VicGeographiesFeature<TProperties, TGeometry>,
    TProperties,
    TGeometry
  >;
}

export class VicNoDataGeographies<
    TProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon,
    TCategoricalValue extends string = string
  >
  extends VicBaseDataGeographyConfig<
    VicGeographiesFeature<TProperties, TGeometry>,
    TProperties,
    TGeometry
  >
  implements
    VicNoDataGeographiesOptions<TProperties, TGeometry, TCategoricalValue>
{
  override readonly hasAttributeData: false;
  readonly categorical: VicCategoricalDimension<
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
      VicNoDataGeographiesOptions<TProperties, TGeometry, TCategoricalValue>
    >
  ) {
    super();
    Object.assign(this, DEFAULT);
    Object.assign(this, options);
    this.hasAttributeData = false;
  }
}

export function vicNoDataGeographies<
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
  TCategoricalValue extends string = string
>(
  options?: Partial<
    VicNoDataGeographiesOptions<TProperties, TGeometry, TCategoricalValue>
  >
) {
  return new VicNoDataGeographies(options);
}
