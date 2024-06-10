import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { VicXOrdinalAxisModule } from 'projects/viz-components/src/lib/axes/x-ordinal/x-ordinal-axis.module';
import { VicXQuantitativeAxisModule } from 'projects/viz-components/src/lib/axes/x-quantitative/x-quantitative-axis.module';
import { VicYOrdinalAxisModule } from 'projects/viz-components/src/lib/axes/y-ordinal/y-ordinal-axis.module';
import { VicYQuantitativeAxisModule } from 'projects/viz-components/src/lib/axes/y-quantitative-axis/y-quantitative-axis.module';
import { VicBarsModule } from 'projects/viz-components/src/lib/bars/bars.module';
import { VicChartModule } from 'projects/viz-components/src/lib/chart/chart.module';
import { VicHtmlTooltipModule } from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.module';
import { VicXyBackgroundModule } from 'projects/viz-components/src/lib/xy-background/xy-background.module';
import { VicXyChartModule } from 'projects/viz-components/src/lib/xy-chart/xy-chart.module';
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
    VicYOrdinalAxisModule,
    VicXQuantitativeAxisModule,
    SharedModule,
    VicHtmlTooltipModule,
    MatButtonModule,
  ],
})
export class BarsModule {}
