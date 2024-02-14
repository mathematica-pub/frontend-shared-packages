import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GeographiesClickDirective } from './geographies-click.directive';
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
