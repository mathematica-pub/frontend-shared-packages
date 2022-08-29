import { AttributeDataDimensionConfig } from '../../geographies/geographies.config';
import { MapContent } from '../../map-chart/map-content';

export class MapContentStub extends MapContent {
  setScaleAndConfig(scale: any, config: AttributeDataDimensionConfig): void {
    return;
  }
}
