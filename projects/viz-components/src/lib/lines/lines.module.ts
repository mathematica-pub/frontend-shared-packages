import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LinesComponent } from './lines.component';

@NgModule({
  declarations: [LinesComponent],
  imports: [CommonModule],
  exports: [LinesComponent],
})
export class VzcLinesModule {}
