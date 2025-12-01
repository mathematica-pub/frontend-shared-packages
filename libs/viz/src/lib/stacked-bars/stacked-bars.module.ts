import { NgModule } from '@angular/core';
import { StackedBarsEventsDirective } from './events/stacked-bars-events.directive';
import { StackedBarsComponent } from './stacked-bars.component';

@NgModule({
  imports: [StackedBarsComponent, StackedBarsEventsDirective],
  exports: [StackedBarsComponent, StackedBarsEventsDirective],
})
export class VicStackedBarsModule {}
