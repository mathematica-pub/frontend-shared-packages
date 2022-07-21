import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarsRoutingModule } from './bars-routing.module';
import { BarsComponent } from './bars.component';
import {
  VzcBarsModule,
  VzcChartModule,
  VzcXQuantitativeAxisModule,
  VzcYOrdinalAxisModule,
} from 'viz-components';

@NgModule({
  declarations: [BarsComponent],
  imports: [
    CommonModule,
    BarsRoutingModule,
    VzcBarsModule,
    VzcChartModule,
    VzcXQuantitativeAxisModule,
    VzcYOrdinalAxisModule,
  ],
})
export class BarsModule {}
