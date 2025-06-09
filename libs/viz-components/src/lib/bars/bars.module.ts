import { NgModule } from '@angular/core';
import { BarsComponent } from './bars.component';
import { BarsClickDirective } from './events/bars-click.directive';
import { BarsEventsDirective } from './events/bars-events.directive';
import { BarsHoverMoveDirective } from './events/bars-hover-move.directive';
import { BarsHoverDirective } from './events/bars-hover.directive';
import { BarsInputEventDirective } from './events/bars-input-event.directive';

@NgModule({
  imports: [
    BarsComponent,
    BarsClickDirective,
    BarsHoverDirective,
    BarsHoverMoveDirective,
    BarsInputEventDirective,
    BarsEventsDirective,
  ],
  exports: [
    BarsComponent,
    BarsHoverDirective,
    BarsHoverMoveDirective,
    BarsInputEventDirective,
    BarsClickDirective,
    BarsEventsDirective,
  ],
})
export class VicBarsModule {}
