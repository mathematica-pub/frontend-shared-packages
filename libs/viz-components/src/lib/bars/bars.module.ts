import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BarsComponent } from './bars.component';
import { BarsClickDirective } from './events/bars-click.directive';
import { BarsHoverMoveDirective } from './events/bars-hover-move.directive';
import { BarsHoverDirective } from './events/bars-hover.directive';
import { BarsInputEventDirective } from './events/bars-input-event.directive';

@NgModule({
  declarations: [
    BarsComponent,
    BarsHoverDirective,
    BarsHoverMoveDirective,
    BarsInputEventDirective,
    BarsClickDirective,
  ],
  imports: [CommonModule],
  exports: [
    BarsComponent,
    BarsHoverDirective,
    BarsHoverMoveDirective,
    BarsInputEventDirective,
    BarsClickDirective,
  ],
})
export class VicBarsModule {}
