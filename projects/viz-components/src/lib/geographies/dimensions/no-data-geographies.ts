import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { VicFillPattern } from '../../data-marks/dimensions/pattern-predicate';
import { VicGeographiesFeature } from '../geographies';
import { VicBaseDataGeographyConfig } from './base-data-geographies';

export class VicNoDataGeographies<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends VicBaseDataGeographyConfig<Datum, TProperties, TGeometry> {
  /**
   * The pattern for noDataGeography. If provided, fill will be overridden.
   */
  fillPatterns: VicFillPattern<VicGeographiesFeature<TProperties, TGeometry>>[];

  constructor(
    init?: Partial<VicNoDataGeographies<Datum, TProperties, TGeometry>>
  ) {
    super();
    this.strokeColor = 'dimgray';
    this.strokeWidth = '1';
    this.fill = 'none';
    Object.assign(this, init);
  }
}

// export interface VicGeographyNoDataPatternPredicate<
//   TProperties,
//   TGeometry extends Geometry = MultiPolygon | Polygon
// > {
//   name: string;
//   predicate: (d: VicGeographiesFeature<TProperties, TGeometry>) => boolean;
// }
