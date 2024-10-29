import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LinesClickDirective } from './events/lines-click.directive';
import { LinesHoverMoveDirective } from './events/lines-hover-move.directive';
import { LinesHoverDirective } from './events/lines-hover.directive';
import { LinesInputEventDirective } from './events/lines-input-event.directive';
import { LinesMarkerClickDirective } from './events/lines-marker-click.directive';
import { LinesComponent } from './lines.component';

@NgModule({
  declarations: [
    LinesComponent,
    LinesMarkerClickDirective,
    LinesClickDirective,
    LinesHoverMoveDirective,
    LinesInputEventDirective,
    LinesHoverDirective,
  ],
  imports: [CommonModule],
  exports: [
    LinesComponent,
    LinesMarkerClickDirective,
    LinesClickDirective,
    LinesHoverDirective,
    LinesHoverMoveDirective,
    LinesInputEventDirective,
  ],
})
export class VicLinesModule {}
