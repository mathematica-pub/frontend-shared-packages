import { NgModule } from '@angular/core';
import { StackedAreaEventsDirective } from './events/stacked-area-events.directive';
import { StackedAreaComponent } from './stacked-area.component';

@NgModule({
  imports: [StackedAreaComponent, StackedAreaEventsDirective],
  exports: [StackedAreaComponent, StackedAreaEventsDirective],
})
export class VicStackedAreaModule {}
