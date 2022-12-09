import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  VicBarsModule,
  VicChartModule,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYOrdinalAxisModule,
} from 'projects/viz-components/src/public-api';
import { SharedModule } from '../shared/shared.module';
import { BarsRoutingModule } from './bars-example-routing.module';
import { BarsExampleComponent } from './bars-example.component';

@NgModule({
  declarations: [BarsExampleComponent],
  imports: [
    CommonModule,
    BarsRoutingModule,
    VicBarsModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    VicChartModule,
    VicXyBackgroundModule,
    VicXyChartModule,
    SharedModule,
  ],
})
export class BarsModule {}
