import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { VicGeographiesModule } from 'projects/viz-components/src/lib/geographies/geographies.module';
import {
  VicMapChartModule,
  VicMapLegendModule,
} from 'projects/viz-components/src/public-api';
import { SharedModule } from '../shared/shared.module';
import { MapExampleRoutingModule } from './map-example-routing.module';
import { MapExampleComponent } from './map-example.component';

@NgModule({
  declarations: [MapExampleComponent],
  imports: [
    CommonModule,
    MapExampleRoutingModule,
    VicMapChartModule,
    VicGeographiesModule,
    VicMapLegendModule,
    SharedModule,
    MatSelectModule,
  ],
})
export class MapExampleModule {}
