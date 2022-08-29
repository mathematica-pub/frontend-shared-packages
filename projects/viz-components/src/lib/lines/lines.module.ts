import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LinesHoverAndMoveEvent } from './lines-hover-move-event.directive';
import { LinesInputEvent } from './lines-input-event.directive';
import { LinesComponent } from './lines.component';

@NgModule({
  declarations: [LinesComponent, LinesHoverAndMoveEvent, LinesInputEvent],
  imports: [CommonModule],
  exports: [LinesComponent, LinesHoverAndMoveEvent, LinesInputEvent],
})
export class VicLinesModule {}
