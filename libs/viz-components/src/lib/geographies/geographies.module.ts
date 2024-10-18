import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GeographiesClickDirective } from './events/geographies-click.directive';
import { GeographiesHoverMoveDirective } from './events/geographies-hover-move.directive';
import { GeographiesHoverDirective } from './events/geographies-hover.directive';
import { GeographiesInputEventDirective } from './events/geographies-input-event.directive';
import { GeographiesComponent } from './geographies.component';

@NgModule({
  declarations: [
    GeographiesComponent,
    GeographiesHoverMoveDirective,
    GeographiesHoverDirective,
    GeographiesInputEventDirective,
    GeographiesClickDirective,
  ],
  imports: [CommonModule],
  exports: [
    GeographiesComponent,
    GeographiesHoverMoveDirective,
    GeographiesHoverDirective,
    GeographiesInputEventDirective,
    GeographiesClickDirective,
  ],
})
export class VicGeographiesModule {}
