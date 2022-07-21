import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  VzcChartModule,
  VzcLinesModule,
  VzcXOrdinalAxisModule,
  VzcXyChartSpaceModule,
  VzcYOrdinalAxisModule,
} from 'viz-components';
import { LinesDemoRoutingModule } from './lines-demo-routing.module';
import { LinesDemoComponent } from './lines-demo.component';

@NgModule({
  declarations: [LinesDemoComponent],
  imports: [
    CommonModule,
    LinesDemoRoutingModule,
    VzcChartModule,
    VzcLinesModule,
    VzcXyChartSpaceModule,
    VzcXOrdinalAxisModule,
    VzcYOrdinalAxisModule,
  ],
})
export class LinesDemoModule {}
