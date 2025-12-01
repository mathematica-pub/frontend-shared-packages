import { NgModule } from '@angular/core';
import { GroupedBarsEventsDirective } from './events/grouped-bars-events.directive';
import { GroupedBarsComponent } from './grouped-bars.component';

@NgModule({
  imports: [GroupedBarsComponent, GroupedBarsEventsDirective],
  exports: [GroupedBarsComponent, GroupedBarsEventsDirective],
})
export class VicGroupedBarsModule {}
