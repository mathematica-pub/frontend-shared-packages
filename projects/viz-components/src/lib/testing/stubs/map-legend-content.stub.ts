import { MapLegendContent } from '../../map-legend/map-legend-content';

export class MapLegendContentStub<Datum> extends MapLegendContent<Datum> {
  getValuesFromScale(): number[] {
    return [1, 12];
  }

  getLeftOffset(values?: number[]): number {
    return 12;
  }
}
