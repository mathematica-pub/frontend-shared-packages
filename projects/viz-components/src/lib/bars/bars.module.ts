import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BarsInputEventDirective } from './bars-input-event.directive';
import { BarsHoverEventDirective } from './bars-input-event.directive.spec';
import { BarsComponent } from './bars.component';

@NgModule({
  declarations: [
    BarsComponent,
    BarsHoverEventDirective,
    BarsInputEventDirective,
  ],
  imports: [CommonModule],
  exports: [BarsComponent, BarsHoverEventDirective, BarsInputEventDirective],
})
export class VicBarsModule {}
