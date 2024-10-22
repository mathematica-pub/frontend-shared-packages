import { MarksOptions, VicMapAuxMarks } from '../../marks';

export class MapAuxMarksStub<Datum> extends VicMapAuxMarks<
  Datum,
  MarksOptions<Datum>
> {
  drawMarks(): void {
    return;
  }
}
