import { VicDataMarksConfig } from '../../data-marks/data-marks.config';
import { MapDataMarksBase } from '../../map-data-marks/map-data-marks-base';

export class MapDataMarksBaseStub<Datum> extends MapDataMarksBase<
  Datum,
  VicDataMarksConfig<Datum>
> {
  override setPropertiesFromConfig(): void {
    return;
  }
  override setPropertiesFromRanges(useTransition: boolean): void {
    return;
  }
  override setValueArrays(): void {
    return;
  }
  drawMarks(): void {
    return;
  }
  resizeMarks(): void {
    return;
  }
}
