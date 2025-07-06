import { NgModule } from '@angular/core';
import { BarsComponent } from './bars.component';
import { BarsEventsDirective } from './events/bars-events.directive';

@NgModule({
  imports: [BarsComponent, BarsEventsDirective],
  exports: [BarsComponent, BarsEventsDirective],
})
export class VicBarsModule {}
