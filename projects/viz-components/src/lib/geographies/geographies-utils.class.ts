import { maxIndex, polygonArea } from 'd3';
import { Feature, MultiPolygon } from 'geojson';
import polylabel from 'polylabel';

export class VicGeographiesUtils {
  public static getPolyLabelCentroid(
    feature: Feature<MultiPolygon, any>,
    projection: any
  ): [number, number] {
    const hasMultiPolys = feature.geometry.coordinates.length > 1;
    const largestIndex = !hasMultiPolys
      ? 0
      : maxIndex(
          feature.geometry.coordinates.map((polygon) => {
            return polygonArea(polygon[0] as [number, number][]);
          })
        );
    const largestPolygon = feature.geometry.coordinates[largestIndex];
    const projectedPoints = !hasMultiPolys
      ? (largestPolygon.map(projection) as [number, number][])
      : (largestPolygon[0].map(projection) as [number, number][]);
    return polylabel([projectedPoints]);
  }

  public static getHawaiiCentroid(
    feature: Feature<MultiPolygon, any>,
    projection: any
  ): [number, number] {
    const startPolygon = feature.geometry.coordinates[0][0].map(projection) as [
      number,
      number
    ][];
    const endPolygon = feature.geometry.coordinates[
      feature.geometry.coordinates.length - 1
    ][0].map(projection) as [number, number][];

    const hawaiiApproxStartCoords = startPolygon[0];
    const hawaiiApproxEndCoords = endPolygon[0];
    return [
      hawaiiApproxStartCoords[0] +
        (hawaiiApproxEndCoords[0] - hawaiiApproxStartCoords[0]) / 2,
      hawaiiApproxStartCoords[1],
    ];
  }
}
