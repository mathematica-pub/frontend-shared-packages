import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GeographiesHoverAndMoveEventDirective } from './geographies-hover-move-event.directive';
import { GeographiesComponent } from './geographies.component';

@NgModule({
  declarations: [GeographiesComponent, GeographiesHoverAndMoveEventDirective],
  imports: [CommonModule],
  exports: [GeographiesComponent, GeographiesHoverAndMoveEventDirective],
})
export class VicGeographiesModule {}
