import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StackedAreaHoverAndMoveEventDirective } from './stacked-area-hover-move-event.directive';
import { StackedAreaInputEventDirective } from './stacked-area-input-event.directive';
import { StackedAreaComponent } from './stacked-area.component';

@NgModule({
  declarations: [
    StackedAreaComponent,
    StackedAreaHoverAndMoveEventDirective,
    StackedAreaInputEventDirective,
  ],
  imports: [CommonModule],
  exports: [
    StackedAreaComponent,
    StackedAreaHoverAndMoveEventDirective,
    StackedAreaInputEventDirective,
  ],
})
export class VicStackedAreaModule {}
