import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GeographiesHoverEventDirective } from './geographies-hover-event.directive';
import { GeographiesHoverAndMoveEventDirective } from './geographies-hover-move-event.directive';
import { GeographiesInputEventDirective } from './geographies-input-event.directive';
import { GeographiesComponent } from './geographies.component';

@NgModule({
  declarations: [
    GeographiesComponent,
    GeographiesHoverAndMoveEventDirective,
    GeographiesHoverEventDirective,
    GeographiesInputEventDirective,
  ],
  imports: [CommonModule],
  exports: [
    GeographiesComponent,
    GeographiesHoverAndMoveEventDirective,
    GeographiesHoverEventDirective,
    GeographiesInputEventDirective,
  ],
})
export class VicGeographiesModule {}
