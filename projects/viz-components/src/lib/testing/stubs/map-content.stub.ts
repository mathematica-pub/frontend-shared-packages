import { VicAttributeDataDimensionConfig } from '../../geographies/geographies.config';
import { MapContent } from '../../map-chart/map-content';

export class MapContentStub extends MapContent {
  setScaleAndConfig(scale: any, config: VicAttributeDataDimensionConfig): void {
    return;
  }
}
