import { Directive, Input, OnChanges } from '@angular/core';
import { MarksOptions } from '../config/marks-options';
import { Marks } from '../marks';

/**
 * VicAuxMarks
 */
@Directive()
export abstract class VicAuxMarks<
    Datum,
    TMarksConfig extends MarksOptions<Datum>,
  >
  extends Marks
  implements Marks, OnChanges
{
  @Input() config: TMarksConfig;

  initFromConfig(): void {
    this.drawMarks();
  }
}
