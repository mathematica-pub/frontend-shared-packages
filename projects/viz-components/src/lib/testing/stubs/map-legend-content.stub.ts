import { MapLegendContent } from '../../map-legend/map-legend-content';

export class MapLegendContentStub<T> extends MapLegendContent<T> {
  getValuesFromScale(): number[] {
    return [1, 12];
  }

  getLeftOffset(values?: number[]): number {
    return 12;
  }
}
