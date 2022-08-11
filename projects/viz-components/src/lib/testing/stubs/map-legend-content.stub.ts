import { MapLegendContent } from '../../map-legend/map-legend-content';

export class MapLegendContentStub extends MapLegendContent {
  getValuesFromScale(): number[] {
    return [];
  }
  getLeftOffset(values?: number[]): number {
    return 0;
  }
}
