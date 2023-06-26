import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { VicGeographiesModule } from 'projects/viz-components/src/lib/geographies/geographies.module';
import {
  VicHtmlTooltipModule,
  VicMapChartModule,
  VicMapLegendModule,
} from 'projects/viz-components/src/public-api';
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
