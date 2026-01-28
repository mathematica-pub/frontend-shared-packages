import { NgModule } from '@angular/core';
import { LinesEventsDirective } from './events/lines-events.directive';
import { LinesComponent } from './lines.component';

@NgModule({
  imports: [LinesComponent, LinesEventsDirective],
  exports: [LinesComponent, LinesEventsDirective],
})
export class VicLinesModule {}
