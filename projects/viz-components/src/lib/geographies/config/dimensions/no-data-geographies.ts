import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicCategoricalDimension } from '../../../data-dimensions/categorical-dimension';
import { VicGeographiesFeature } from '../../geographies-feature';
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
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
  TCategoricalValue extends string = string
> extends VicBaseDataGeographyOptions<Datum, TProperties, TGeometry> {
  categorical: VicCategoricalDimension<
    VicGeographiesFeature<TProperties, TGeometry>,
    TCategoricalValue
  >;
}

export class VicNoDataGeographies<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
  TCategoricalValue extends string = string
> extends VicBaseDataGeographyConfig<Datum, TProperties, TGeometry> {
  readonly categorical: VicCategoricalDimension<string, TCategoricalValue>;

  constructor(
    options?: Partial<
      VicNoDataGeographiesOptions<Datum, TProperties, TGeometry>
    >
  ) {
    super();
    Object.assign(this, options);
    this.strokeColor = this.strokeColor ?? DEFAULT.strokeColor;
    this.strokeWidth = this.strokeWidth ?? DEFAULT.strokeWidth;
  }
}

export function vicNoDataGeographies<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
>(
  options?: Partial<VicNoDataGeographiesOptions<Datum, TProperties, TGeometry>>
) {
  return new VicNoDataGeographies(options);
}
