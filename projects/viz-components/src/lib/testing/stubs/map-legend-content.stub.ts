/* eslint-disable @typescript-eslint/no-unused-vars */
import { VicAttributeDataDimensionConfig } from '../../geographies/config/layers/attribute-data-layer/dimensions/attribute-data-bin-types';
import { MapLegend } from '../../map-legend/map-legend-base';

export class MapLegendContentStub<Datum> extends MapLegend<
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
