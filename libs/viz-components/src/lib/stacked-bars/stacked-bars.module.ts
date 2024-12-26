import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StackedBarsHoverMoveDirective } from './events/stacked-bars-hover-move.directive';
import { StackedBarsComponent } from './stacked-bars.component';

@NgModule({
  declarations: [StackedBarsComponent, StackedBarsHoverMoveDirective],
  imports: [CommonModule],
  exports: [StackedBarsComponent, StackedBarsHoverMoveDirective],
})
export class VicStackedBarsModule {}
