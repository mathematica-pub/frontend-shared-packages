import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesInputEventDirective } from './geographies-input-event.directive';
import { GeographiesComponent } from './geographies.component';

@NgModule({
  declarations: [
    GeographiesComponent,
    GeographiesHoverMoveDirective,
    GeographiesHoverDirective,
    GeographiesInputEventDirective,
  ],
  imports: [CommonModule],
  exports: [
    GeographiesComponent,
    GeographiesHoverMoveDirective,
    GeographiesHoverDirective,
    GeographiesInputEventDirective,
  ],
})
export class VicGeographiesModule {}
