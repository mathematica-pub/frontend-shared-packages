import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicFillPattern } from '../../../data-marks/dimensions/fill-pattern';
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
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends VicBaseDataGeographyOptions<Datum, TProperties, TGeometry> {
  /**
   * The pattern for noDataGeography. If provided, fill will be overridden.
   */
  fillPatterns: VicFillPattern<VicGeographiesFeature<TProperties, TGeometry>>[];
}

export class VicNoDataGeographies<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends VicBaseDataGeographyConfig<Datum, TProperties, TGeometry> {
  fillPatterns: VicFillPattern<VicGeographiesFeature<TProperties, TGeometry>>[];

  constructor(
    options?: Partial<
      VicNoDataGeographiesOptions<Datum, TProperties, TGeometry>
    >
  ) {
    super();
    Object.assign(this, options);
    this.fill = this.fill ?? DEFAULT.fill;
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
