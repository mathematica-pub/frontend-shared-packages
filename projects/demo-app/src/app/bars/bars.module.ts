import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  VzcBarsModule,
  VzcChartModule,
  VzcXQuantitativeAxisModule,
  VzcXyBackgroundModule,
  VzcXyChartModule,
  VzcYOrdinalAxisModule,
} from 'projects/viz-components/src/public-api';
import { SharedModule } from '../shared/shared.module';
import { BarsRoutingModule } from './bars-routing.module';
import { BarsComponent } from './bars.component';

@NgModule({
  declarations: [BarsComponent],
  imports: [
    CommonModule,
    BarsRoutingModule,
    VzcBarsModule,
    VzcXQuantitativeAxisModule,
    VzcYOrdinalAxisModule,
    VzcChartModule,
    VzcXyBackgroundModule,
    VzcXyChartModule,
    SharedModule,
  ],
})
export class BarsModule {}
