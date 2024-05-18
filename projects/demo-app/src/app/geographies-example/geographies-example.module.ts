import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { VicGeographiesModule } from 'projects/viz-components/src/lib/geographies/geographies.module';
import { VicMapChartModule } from 'projects/viz-components/src/lib/map-chart/map-chart.module';
import { VicMapLegendModule } from 'projects/viz-components/src/lib/map-legend/map-legend.module';
import { VicHtmlTooltipModule } from 'projects/viz-components/src/lib/tooltips/html-tooltip/html-tooltip.module';
import { SharedModule } from '../shared/shared.module';
import { GeographiesExampleRoutingModule } from './geographies-example-routing.module';
import { GeographiesExampleComponent } from './geographies-example.component';

@NgModule({
  declarations: [GeographiesExampleComponent],
  imports: [
    CommonModule,
    GeographiesExampleRoutingModule,
    VicMapChartModule,
    VicGeographiesModule,
    VicMapLegendModule,
    SharedModule,
    MatSelectModule,
    VicHtmlTooltipModule,
    MatButtonToggleModule,
  ],
})
export class GeographiesExampleModule {}
