import { NgModule } from '@angular/core';
import { GeographiesClickDirective } from './events/geographies-click.directive';
import { GeographiesEventsDirective } from './events/geographies-events.directive';
import { GeographiesHoverMoveDirective } from './events/geographies-hover-move.directive';
import { GeographiesHoverDirective } from './events/geographies-hover.directive';
import { GeographiesInputEventDirective } from './events/geographies-input-event.directive';
import { GeographiesComponent } from './geographies.component';

@NgModule({
  imports: [
    GeographiesComponent,
    GeographiesHoverMoveDirective,
    GeographiesHoverDirective,
    GeographiesInputEventDirective,
    GeographiesClickDirective,
    GeographiesEventsDirective,
  ],
  exports: [
    GeographiesComponent,
    GeographiesHoverMoveDirective,
    GeographiesHoverDirective,
    GeographiesInputEventDirective,
    GeographiesClickDirective,
    GeographiesEventsDirective,
  ],
})
export class VicGeographiesModule {}
