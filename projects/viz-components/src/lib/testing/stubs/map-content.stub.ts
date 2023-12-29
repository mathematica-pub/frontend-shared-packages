import { VicAttributeDataDimensionConfig } from '../../geographies/geographies.config';
import { MapDataMarksBase } from '../../map-chart/map-data-marks-base';

export class MapDataMarksBaseStub extends MapDataMarksBase {
  override drawMarks(): void {
    return;
  }
  override resizeMarks(): void {
    return;
  }
  setScaleAndConfig(scale: any, config: VicAttributeDataDimensionConfig): void {
    return;
  }
}
