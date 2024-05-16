/* eslint-disable @typescript-eslint/no-unused-vars */
import { VicAttributeDataDimensionConfig } from '../../geographies/geographies.config';
import { MapLegendContent } from '../../map-legend/map-legend-content';

export class MapLegendContentStub<Datum> extends MapLegendContent<
  Datum,
  VicAttributeDataDimensionConfig<Datum>
> {
  getValuesFromScale(): number[] {
    return [1, 12];
  }

  getLeftOffset(values: number[]): number {
    return 12;
  }
}
