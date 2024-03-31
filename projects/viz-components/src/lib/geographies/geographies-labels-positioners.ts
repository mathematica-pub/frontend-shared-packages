import { GeoPath, GeoProjection, maxIndex, polygonArea } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import polylabel from 'polylabel';
import { VicPosition } from '../core/types/layout';
import { VicGeographiesFeature } from './geographies';

export class VicGeographiesLabelsPositioners {
  static positionAtCentroid<TProperties, TGeometry extends Geometry>(
    feature: VicGeographiesFeature<TProperties, TGeometry>,
    path: GeoPath
  ): VicPosition {
    const c = path.centroid(feature);
    return { x: c[0], y: c[1] };
  }

  static positionHawaiiOnGeoAlbersUsa<TProperties>(
    feature: VicGeographiesFeature<TProperties, MultiPolygon>,
    projection: GeoProjection
  ): VicPosition {
    const startPolygon =
      // we need to cast because Position can return two or three numbers but GeoProjection
      // can only handle [number, number]
      (feature.geometry.coordinates[0][0] as [number, number][]).map(
        projection
      );
    const endPolygon = (
      feature.geometry.coordinates[
        feature.geometry.coordinates.length - 1
      ][0] as [number, number][]
    ).map(projection);

    const approxStartCoords = startPolygon[0];
    const approxEndCoords = endPolygon[0];
    return {
      x: approxStartCoords[0] + (approxEndCoords[0] - approxStartCoords[0]) / 2,
      y: approxStartCoords[1],
    };
  }
  static positionWithPolylabel<
    TProperties,
    TGeometry extends MultiPolygon | Polygon = MultiPolygon | Polygon
  >(
    feature: VicGeographiesFeature<TProperties, TGeometry>,
    projection: GeoProjection
  ): VicPosition {
    const isMultiPolygon = feature.geometry.coordinates.length > 1;
    let largestIndex = 0;
    let largestPolygon: [number, number][];
    if (isMultiPolygon) {
      const coords = feature.geometry.coordinates as [number, number][][][];
      largestIndex = maxIndex(
        coords.map((polygon) => {
          return polygonArea(polygon[0]);
        })
      );
      largestPolygon = coords[largestIndex][0];
    } else {
      const coords = feature.geometry.coordinates as [number, number][][];
      largestPolygon = coords[0];
    }
    const projectedPoints = largestPolygon.map(projection);
    const adjustedPosition = polylabel([projectedPoints]);
    return { x: adjustedPosition[0], y: adjustedPosition[1] };
  }
}
