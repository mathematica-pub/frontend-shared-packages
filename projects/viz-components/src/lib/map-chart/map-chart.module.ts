import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VicHtmlTooltipModule } from '../tooltips/html-tooltip/html-tooltip.module';
import { MapChartComponent } from './map-chart.component';

@NgModule({
  declarations: [MapChartComponent],
  imports: [CommonModule, VicHtmlTooltipModule],
  exports: [MapChartComponent],
})
export class VicMapChartModule {}
