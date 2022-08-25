import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  EmitLinesTooltipData,
  StyleLineForHover,
  StyleMarkersForHover,
} from './lines-effects.directive';
import { LinesHoverEvent } from './lines-hover.directive';
import { LinesComponent } from './lines.component';

@NgModule({
  declarations: [
    LinesComponent,
    LinesHoverEvent,
    StyleLineForHover,
    StyleMarkersForHover,
    EmitLinesTooltipData,
  ],
  imports: [CommonModule],
  exports: [
    LinesComponent,
    LinesHoverEvent,
    StyleLineForHover,
    StyleMarkersForHover,
    EmitLinesTooltipData,
  ],
})
export class VzcLinesModule {}
