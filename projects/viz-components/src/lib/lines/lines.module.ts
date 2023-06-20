import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LinesClickDirective } from './lines-click.directive';
import { LinesHoverAndMoveDirective } from './lines-hover-move.directive';
import { LinesHoverDirective } from './lines-hover.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';
import { LinesMarkerClickDirective } from './lines-marker-click.directive';
import { LinesComponent } from './lines.component';

@NgModule({
  declarations: [
    LinesComponent,
    LinesMarkerClickDirective,
    LinesClickDirective,
    LinesHoverAndMoveDirective,
    LinesInputEventDirective,
    LinesHoverDirective,
  ],
  imports: [CommonModule],
  exports: [
    LinesComponent,
    LinesMarkerClickDirective,
    LinesClickDirective,
    LinesHoverDirective,
    LinesHoverAndMoveDirective,
    LinesInputEventDirective,
  ],
})
export class VicLinesModule {}
