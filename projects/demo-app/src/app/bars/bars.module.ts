import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarsRoutingModule } from './bars-routing.module';
import { BarsComponent } from './bars.component';
import {
  VzcBarsModule,
  VzcChartModule,
  VzcXQuantitativeAxisModule,
  VzcXyChartBackgroundModule,
  VzcXyChartSpaceModule,
  VzcYOrdinalAxisModule,
} from 'projects/viz-components/src/public-api';

@NgModule({
  declarations: [BarsComponent],
  imports: [
    CommonModule,
    BarsRoutingModule,
    VzcBarsModule,
    VzcXQuantitativeAxisModule,
    VzcYOrdinalAxisModule,
    VzcChartModule,
    VzcXyChartBackgroundModule,
    VzcXyChartSpaceModule,
  ],
})
export class BarsModule {}
