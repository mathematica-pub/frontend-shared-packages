import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BarsComponent } from './bars.component';

@NgModule({
  declarations: [BarsComponent],
  imports: [CommonModule],
  exports: [BarsComponent],
})
export class MChartsBarsModule {}
