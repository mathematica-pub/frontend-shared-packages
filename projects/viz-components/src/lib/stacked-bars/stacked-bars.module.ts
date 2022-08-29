import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StackedBarsComponent } from './stacked-bars.component';

@NgModule({
  declarations: [StackedBarsComponent],
  imports: [CommonModule],
  exports: [StackedBarsComponent],
})
export class VicStackedBarsModule {}
