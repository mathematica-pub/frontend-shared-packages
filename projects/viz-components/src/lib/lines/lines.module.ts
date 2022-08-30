import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LinesHoverAndMoveEventDirective } from './lines-hover-move-event.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';
import { LinesComponent } from './lines.component';

@NgModule({
  declarations: [
    LinesComponent,
    LinesHoverAndMoveEventDirective,
    LinesInputEventDirective,
  ],
  imports: [CommonModule],
  exports: [
    LinesComponent,
    LinesHoverAndMoveEventDirective,
    LinesInputEventDirective,
  ],
})
export class VicLinesModule {}
