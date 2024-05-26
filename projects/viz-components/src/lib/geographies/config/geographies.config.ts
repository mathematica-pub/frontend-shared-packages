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
} from '../../data-marks/data-marks-types';
import { VicDataGeographies } from './dimensions/data-geographies';
import { VicNoDataGeographies } from './dimensions/no-data-geographies';

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
  dataGeographies: VicDataGeographies<Datum, TProperties, TGeometry>;
  /**
   * A configuration object that pertains to geographies that a user wants to draw without attribute data, for example the outline of a country.
   */
  noDataGeographies: VicNoDataGeographies<Datum, TProperties, TGeometry>[];
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
  readonly dataGeographies: VicDataGeographies<Datum, TProperties, TGeometry>;
  readonly noDataGeographies: VicNoDataGeographies<
    Datum,
    TProperties,
    TGeometry
  >[];
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
    this.dataGeographies.attributeData.setPropertiesFromData(uniqueDatums);
    this.setAttributeData(uniqueDatums);
  }

  private getUniqueDatumsByGeoAccessor(): Datum[] {
    const uniqueByGeoAccessor = (arr: Datum[], set = new Set()) =>
      arr.filter(
        (x) =>
          !set.has(this.dataGeographies.attributeData.geoAccessor(x)) &&
          set.add(this.dataGeographies.attributeData.geoAccessor(x))
      );
    return uniqueByGeoAccessor(this.data);
  }

  private setAttributeData(uniqueDatums: Datum[]): void {
    this.values.attributeValuesByGeographyIndex = new InternMap(
      uniqueDatums.map((d) => {
        const value = this.dataGeographies.attributeData.valueAccessor(d);
        return [
          this.dataGeographies.attributeData.geoAccessor(d),
          value === null || value === undefined ? NaN : value,
        ];
      })
    );
    this.values.datumsByGeographyIndex = new InternMap(
      uniqueDatums.map((d) => {
        return [this.dataGeographies.attributeData.geoAccessor(d), d];
      })
    );
  }
}

/**
 * A factory function to create a geographies configuration object to be used with vic-data-marks-geographies component.
 * @param {Partial<VicGeographiesOptions<Datum, TProperties, TGeometry>>} options - **REQUIRED**
 * @param {ExtendedFeature | ExtendedFeatureCollection | GeoGeometryObjects | ExtendedGeometryCollection} options.boundary: ExtendedFeature | ExtendedFeatureCollection | GeoGeometryObjects | ExtendedGeometryCollection - **REQUIRED** - A feature or geometry object or collection that defines the extents of the map to be drawn. Used for scaling the map.
 * @param {VicDataGeographies<Datum, TProperties, TGeometry>} options.dataGeographies - **REQUIRED** - set with vicDataGeographies function.
 * @param {VicNoDataGeographies<Datum, TProperties, TGeometry>[]} options.noDataGeographies - **REQUIRED** - set with vicNoDataGeographies function.
 * @param {GeoProjection} options.projection - A projection function that maps a point in the map's coordinate space to a point in the SVG's coordinate space. Default is d3.geoAlbersUsa().
 * @returns
 */

export function vicGeographies<
  Datum,
  TProperties extends GeoJsonProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
>(
  options: Partial<VicGeographiesOptions<Datum, TProperties, TGeometry>>
): VicGeographiesConfig<Datum, TProperties, TGeometry> {
  return new VicGeographiesConfig(options);
}
