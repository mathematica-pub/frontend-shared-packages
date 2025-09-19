import { NgModule } from '@angular/core';
import { GeographiesEventsDirective } from './events/geographies-events.directive';
import { GeographiesComponent } from './geographies.component';

@NgModule({
  imports: [GeographiesComponent, GeographiesEventsDirective],
  exports: [GeographiesComponent, GeographiesEventsDirective],
})
export class VicGeographiesModule {}
