import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  ExtendedGeometryCollection,
  geoAlbersUsa,
  GeoGeometryObjects,
  GeoProjection,
  InternMap,
} from 'd3';
import {
  GeoJsonProperties,
  GeometryObject as Geometry,
  MultiPolygon,
  Polygon,
} from 'geojson';
import {
  VicDataMarksConfig,
  VicDataMarksOptions,
} from '../../data-marks/data-marks.config';
import { VicGeographiesFeature } from '../geographies-feature';
import { VicGeographiesDataLayer } from './dimensions/data-layer';
import { VicGeographiesNoDataLayer } from './dimensions/no-data-layer';

export class MapDataValues {
  attributeValuesByGeographyIndex: InternMap;
  datumsByGeographyIndex: InternMap;
}

const DEFAULT = {
  projection: geoAlbersUsa(),
};

export interface VicGeographiesOptions<
  Datum,
  TProperties extends GeoJsonProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends VicDataMarksOptions<Datum> {
  /** A feature or geometry object or collection that defines the extents of the map to be drawn.
   * Used for scaling the map.
   */
  boundary:
    | ExtendedFeature
    | ExtendedFeatureCollection
    | GeoGeometryObjects
    | ExtendedGeometryCollection;
  /**
   * A configuration object that pertains to geographies that have attribute data, for example, states in the US each of which have a value for % unemployment.
   */
  dataLayer: VicGeographiesDataLayer<Datum, TProperties, TGeometry>;
  /**
   * A function that derives an identifying string from the GeoJson feature.
   */
  featureIndexAccessor: (
    d: VicGeographiesFeature<TProperties, TGeometry>
  ) => string;
  /**
   * A configuration object that pertains to geographies that a user wants to draw without attribute data, for example the outline of a country.
   */
  noDataLayers: VicGeographiesNoDataLayer<TProperties, TGeometry>[];
  /**
   * A projection function that maps a point in the map's coordinate space to a point in the SVG's coordinate space.
   * @default: d3.geoAlbersUsa().
   */
  projection: GeoProjection;
}

/** Primary configuration object to specify a map with attribute data, intended to be used with GeographiesComponent.
 * Note that while a GeographiesComponent can create geographies without attribute data, for example, to create an
 * outline of a geographic area, it is not intended to draw maps that have no attribute data.
 *
 * The first generic parameter, Datum, is the type of the attribute data that will be used to shade the map areas.
 *
 * The second generic parameter, TProperties, is the type of the properties object that is associated with the GeoJson.
 *
 * The third generic parameter, TGeometry, is the type of the geometry object that is associated with the GeoJson.
 */
export class VicGeographiesConfig<
    Datum,
    TProperties extends GeoJsonProperties,
    TGeometry extends Geometry = MultiPolygon | Polygon
  >
  extends VicDataMarksConfig<Datum>
  implements VicDataMarksOptions<Datum>
{
  readonly boundary:
    | ExtendedFeature
    | ExtendedFeatureCollection
    | GeoGeometryObjects
    | ExtendedGeometryCollection;
  readonly dataLayer: VicGeographiesDataLayer<Datum, TProperties, TGeometry>;
  featureIndexAccessor: (
    d: VicGeographiesFeature<TProperties, TGeometry>
  ) => string;
  readonly noDataLayers: VicGeographiesNoDataLayer<TProperties, TGeometry>[];
  readonly projection: GeoProjection;
  readonly values: MapDataValues = new MapDataValues();

  constructor(
    options: Partial<VicGeographiesOptions<Datum, TProperties, TGeometry>>
  ) {
    super();
    this.projection = DEFAULT.projection;
    Object.assign(this, options);
    this.initPropertiesFromData();
  }

  protected initPropertiesFromData(): void {
    const uniqueDatums = this.getUniqueDatumsByGeoAccessor();
    this.dataLayer.attributeData.setPropertiesFromData(uniqueDatums);
    if (this.noDataLayers) {
      this.noDataLayers.forEach((config) => {
        config.categorical.setPropertiesFromData(config.geographies);
      });
    }
    this.setAttributeData(uniqueDatums);
  }

  private getUniqueDatumsByGeoAccessor(): Datum[] {
    const uniqueByGeoAccessor = (arr: Datum[], set = new Set()) =>
      arr.filter(
        (x) =>
          !set.has(this.dataLayer.attributeData.geoAccessor(x)) &&
          set.add(this.dataLayer.attributeData.geoAccessor(x))
      );
    return uniqueByGeoAccessor(this.data);
  }

  private setAttributeData(uniqueDatums: Datum[]): void {
    this.values.attributeValuesByGeographyIndex = new InternMap(
      uniqueDatums.map((d) => {
        const value = this.dataLayer.attributeData.valueAccessor(d);
        return [
          this.dataLayer.attributeData.geoAccessor(d),
          value === null || value === undefined ? NaN : value,
        ];
      })
    );
    this.values.datumsByGeographyIndex = new InternMap(
      uniqueDatums.map((d) => {
        return [this.dataLayer.attributeData.geoAccessor(d), d];
      })
    );
  }
}
