import { Directive, Input, OnChanges } from '@angular/core';
import { DataMarksConfig, MarksConfig } from '../config/marks-config';
import { Marks } from '../marks';

@Directive()
export abstract class AuxMarks<
    Datum,
    TMarksConfig extends MarksConfig | DataMarksConfig<Datum>,
  >
  extends Marks
  implements Marks, OnChanges
{
  @Input() config: TMarksConfig;

  initFromConfig(): void {
    this.drawMarks();
  }
}
