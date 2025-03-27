import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StackedAreaHoverMoveDirective } from './events/stacked-area-hover-move.directive';
import { StackedAreaInputEventDirective } from './events/stacked-area-input-event.directive';
import { StackedAreaComponent } from './stacked-area.component';

@NgModule({
  imports: [
    CommonModule,
    StackedAreaComponent,
    StackedAreaHoverMoveDirective,
    StackedAreaInputEventDirective,
  ],
  exports: [
    StackedAreaComponent,
    StackedAreaHoverMoveDirective,
    StackedAreaInputEventDirective,
  ],
})
export class VicStackedAreaModule {}
