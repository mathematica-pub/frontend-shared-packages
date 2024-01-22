import type * as CSSType from 'csstype';
import { geoContains, geoPath, maxIndex, polygonArea } from 'd3';
import { VicGeographyLabelConfig } from './geographies.config';
import { ColorUtilities } from '../shared/color-utilities.class';
import { Feature, MultiPolygon } from 'geojson';
import polylabel from 'polylabel';

export class VicGeographiesUtils {
  public static binaryLabelFill(
    d: Feature<MultiPolygon, any>,
    geographyFill: CSSType.Property.Fill,
    darkTextColor: CSSType.Property.Fill,
    lightTextColor: CSSType.Property.Fill,
    config: VicGeographyLabelConfig
  ): string {
    const point = config.labelPositionFunction(d, geoPath(), (x) => x);
    if (geoContains(d, point)) {
      return ColorUtilities.getContrastRatio(lightTextColor, geographyFill) >
        ColorUtilities.getContrastRatio(darkTextColor, geographyFill)
        ? lightTextColor
        : darkTextColor;
    }
    return darkTextColor;
  }

  public static binaryLabelFontWeight(
    d: Feature<MultiPolygon, any>,
    geographyFill: CSSType.Property.Fill,
    darkTextColor: CSSType.Property.Fill,
    lightTextColor: CSSType.Property.Fill,
    darkFontWeight: CSSType.Property.FontWeight,
    lightFontWeight: CSSType.Property.FontWeight,
    config: VicGeographyLabelConfig
  ): CSSType.Property.FontWeight {
    const fontColor = config.labelFillFunction(d, geographyFill);
    if (fontColor === darkTextColor) {
      return darkFontWeight;
    } else if (fontColor === lightTextColor) {
      return lightFontWeight;
    } else {
      throw new Error(
        'Could not determine font weight -- binary label fill is set up wrong!'
      );
    }
  }

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
