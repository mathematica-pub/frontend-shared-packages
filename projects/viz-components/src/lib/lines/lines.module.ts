import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LinesHoverEventDirective } from './lines-hover-event.directive';
import { LinesHoverAndMoveEventDirective } from './lines-hover-move-event.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';
import { LinesComponent } from './lines.component';

@NgModule({
  declarations: [
    LinesComponent,
    LinesHoverAndMoveEventDirective,
    LinesInputEventDirective,
    LinesHoverEventDirective,
  ],
  imports: [CommonModule],
  exports: [
    LinesComponent,
    LinesHoverAndMoveEventDirective,
    LinesInputEventDirective,
    LinesHoverEventDirective,
  ],
})
export class VicLinesModule {}
