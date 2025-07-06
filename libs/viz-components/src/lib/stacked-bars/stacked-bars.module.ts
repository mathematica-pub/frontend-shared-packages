import { NgModule } from '@angular/core';
import { StackedBarsClickDirective } from './events/stacked-bars-click.directive';
import { StackedBarsEventsDirective } from './events/stacked-bars-events.directive';
import { StackedBarsHoverMoveDirective } from './events/stacked-bars-hover-move.directive';
import { StackedBarsHoverDirective } from './events/stacked-bars-hover.directive';
import { StackedBarsInputEventDirective } from './events/stacked-bars-input-event.directive';
import { StackedBarsComponent } from './stacked-bars.component';

@NgModule({
  imports: [
    StackedBarsComponent,
    StackedBarsHoverMoveDirective,
    StackedBarsHoverDirective,
    StackedBarsClickDirective,
    StackedBarsInputEventDirective,
    StackedBarsEventsDirective,
  ],
  exports: [
    StackedBarsComponent,
    StackedBarsHoverMoveDirective,
    StackedBarsHoverDirective,
    StackedBarsClickDirective,
    StackedBarsInputEventDirective,
    StackedBarsEventsDirective,
  ],
})
export class VicStackedBarsModule {}
