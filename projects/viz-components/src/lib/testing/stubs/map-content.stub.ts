import { AttributeDataDimension } from '../../geographies/geographies.model';
import { MapContent } from '../../map-chart/map-content';

export class MapContentStub extends MapContent {
  setScaleAndConfig(scale: any, config: AttributeDataDimension): void {
    return;
  }
}
