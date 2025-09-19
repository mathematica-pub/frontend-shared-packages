import { NgModule } from '@angular/core';
import { DotsComponent } from './dots.component';
import { DotsEventsDirective } from './events/dots-events.directive';

@NgModule({
  imports: [DotsComponent, DotsEventsDirective],
  exports: [DotsComponent, DotsEventsDirective],
})
export class VicDotsModule {}
