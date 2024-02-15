import { maxIndex, polygonArea } from 'd3';
import { Feature, MultiPolygon } from 'geojson';
import polylabel from 'polylabel';

export interface VicGeographiesLabelsPositioner {
  enable: (feature: Feature<MultiPolygon, any>) => boolean;
  position: (
    feature: Feature<MultiPolygon, any>,
    projection: any
  ) => [number, number];
}

export class VicGeographiesLabelsPositionerBottomMiddleBoundingBox
  implements VicGeographiesLabelsPositioner
{
  enable: (feature: Feature<MultiPolygon, any>) => boolean;

  constructor(
    init?: Partial<VicGeographiesLabelsPositionerBottomMiddleBoundingBox>
  ) {
    this.enable = () => true;
    Object.assign(this, init);
  }

  /**
   * Currently just works for multipolygons that are drawn from the bottom right
   * to the top left; if used for anything other than HI in the future, generalize
   * @param feature
   * @param projection
   */
  position(
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

export class VicGeographiesLabelsPositionerPolylabel
  implements VicGeographiesLabelsPositioner
{
  enable: (feature: Feature<MultiPolygon, any>) => boolean;

  constructor(init?: Partial<VicGeographiesLabelsPositionerPolylabel>) {
    this.enable = () => true;
    Object.assign(this, init);
  }

  position(
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
}
