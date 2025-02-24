import { Directive, Input, OnChanges } from '@angular/core';
import { AuxMarksConfig, MarksConfig } from '../config/marks-config';
import { Marks } from '../marks';

@Directive()
export abstract class AuxMarks<
    Datum,
    TMarksConfig extends MarksConfig | AuxMarksConfig<Datum>,
  >
  extends Marks
  implements Marks, OnChanges
{
  @Input() config: TMarksConfig;

  initFromConfig(): void {
    this.drawMarks();
  }
}
