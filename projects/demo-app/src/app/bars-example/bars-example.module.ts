import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { VicBarsModule } from 'projects/viz-components/src/lib/bars/bars.module';
import { VicChartModule } from 'projects/viz-components/src/lib/chart/chart.module';
import { VicHtmlTooltipModule } from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.module';
import { VicXyBackgroundModule } from 'projects/viz-components/src/lib/xy-background/xy-background.module';
import { VicXyChartModule } from 'projects/viz-components/src/lib/xy-chart/xy-chart.module';
import {
  VicXOrdinalAxisModule,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { SharedModule } from '../shared/shared.module';
import { BarsRoutingModule } from './bars-example-routing.module';
import { BarsExampleComponent } from './bars-example.component';

@NgModule({
  declarations: [BarsExampleComponent],
  imports: [
    CommonModule,
    BarsRoutingModule,
    VicChartModule,
    VicBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicXOrdinalAxisModule,
    VicYQuantitativeAxisModule,
    SharedModule,
    VicHtmlTooltipModule,
    MatButtonModule,
  ],
})
export class BarsModule {}
