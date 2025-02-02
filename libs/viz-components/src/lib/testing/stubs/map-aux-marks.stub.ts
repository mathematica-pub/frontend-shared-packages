import { MarksOptions, VicMapAuxMarks } from '../../marks';

export class MapAuxMarksStub<Datum> extends VicMapAuxMarks<
  Datum,
  MarksOptions
> {
  drawMarks(): void {
    return;
  }
}
