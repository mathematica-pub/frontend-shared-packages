import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import {
  VicBarsModule,
  VicChartModule,
  VicHtmlTooltipModule,
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
    VicChartModule,
    VicBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYOrdinalAxisModule,
    VicXQuantitativeAxisModule,
    SharedModule,
    VicHtmlTooltipModule,
    MatButtonModule,
  ],
})
export class BarsModule {}
