import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DotsComponent } from './dots.component';
import { DotsClickDirective } from './events/dots-click.directive';
import { DotsHoverMoveDirective } from './events/dots-hover-move.directive';
import { DotsHoverDirective } from './events/dots-hover.directive';
import { DotsInputEventDirective } from './events/dots-input.directive';

@NgModule({
  imports: [
    CommonModule,
    DotsComponent,
    DotsClickDirective,
    DotsHoverDirective,
    DotsHoverMoveDirective,
    DotsInputEventDirective,
  ],
  exports: [
    DotsComponent,
    DotsClickDirective,
    DotsHoverDirective,
    DotsHoverMoveDirective,
    DotsInputEventDirective,
  ],
})
export class VicDotsModule {}
