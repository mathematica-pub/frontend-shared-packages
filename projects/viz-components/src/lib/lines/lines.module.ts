import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LinesHoverEventDirective } from './lines-hover-event.directive';
import { LinesHoverAndMoveEventDirective } from './lines-hover-move-event.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';
import { LinesMarkerClickEventDirective } from './lines-marker-click-event.directive';
import { LinesComponent } from './lines.component';

@NgModule({
  declarations: [
    LinesComponent,
    LinesMarkerClickEventDirective,
    LinesHoverAndMoveEventDirective,
    LinesInputEventDirective,
    LinesHoverEventDirective,
  ],
  imports: [CommonModule],
  exports: [
    LinesComponent,
    LinesMarkerClickEventDirective,
    LinesHoverEventDirective,
    LinesHoverAndMoveEventDirective,
    LinesInputEventDirective,
  ],
})
export class VicLinesModule {}
