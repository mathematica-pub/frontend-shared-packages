import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BarsHoverEventDirective } from './bars-hover-event.directive';
import { BarsHoverAndMoveEventDirective } from './bars-hover-move-event.directive';
import { BarsInputEventDirective } from './bars-input-event.directive';
import { BarsComponent } from './bars.component';

@NgModule({
  declarations: [
    BarsComponent,
    BarsHoverEventDirective,
    BarsHoverAndMoveEventDirective,
    BarsInputEventDirective,
  ],
  imports: [CommonModule],
  exports: [
    BarsComponent,
    BarsHoverEventDirective,
    BarsHoverAndMoveEventDirective,
    BarsInputEventDirective,
  ],
})
export class VicBarsModule {}
