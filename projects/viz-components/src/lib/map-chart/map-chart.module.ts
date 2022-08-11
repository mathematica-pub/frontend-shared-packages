import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VzcHtmlTooltipModule } from '../html-tooltip/html-tooltip.module';
import { MapChartComponent } from './map-chart.component';

@NgModule({
  declarations: [MapChartComponent],
  imports: [CommonModule, VzcHtmlTooltipModule],
  exports: [MapChartComponent],
})
export class VzcMapChartModule {}
