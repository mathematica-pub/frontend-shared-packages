import { NgModule } from '@angular/core';
import { StackedBarsClickDirective } from './events/stacked-bars-click.directive';
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
  ],
  exports: [
    StackedBarsComponent,
    StackedBarsHoverMoveDirective,
    StackedBarsHoverDirective,
    StackedBarsClickDirective,
    StackedBarsInputEventDirective,
  ],
})
export class VicStackedBarsModule {}
