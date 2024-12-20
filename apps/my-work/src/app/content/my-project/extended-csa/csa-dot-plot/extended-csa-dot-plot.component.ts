import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  VicBarsConfigBuilder,
  VicBarsModule,
  VicStackedBarsConfigBuilder,
  VicStackedBarsModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYOrdinalAxisConfigBuilder,
  VicYOrdinalAxisModule,
} from '@hsi/viz-components';
import { min } from 'd3';
import { CaAccessDotPlotComponent } from '../../ca-access-dot-plot.component';
import { CsaDatum } from '../extended-csa.component';
import { ExtendedCsaStackedBarsComponent } from './csa-stacked-bars/extended-csa-stacked-bars.component';

@Component({
  selector: 'app-extended-csa-dot-plot',
  standalone: true,
  imports: [
    CommonModule,
    VicXyChartModule,
    VicBarsModule,
    VicStackedBarsModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    ExtendedCsaStackedBarsComponent,
  ],
  providers: [
    VicBarsConfigBuilder,
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
  ],
  templateUrl: './extended-csa-dot-plot.component.html',
  styleUrl: './csa-dot-plot.component.scss',
})
export class ExtendedCsaDotPlotComponent extends CaAccessDotPlotComponent {
  override getCurrentRollup(x: CsaDatum, plan: CsaDatum): boolean {
    return x.size === plan.size;
  }

  override getInvisibleStackValue(plan: CsaDatum): number {
    return min([plan.percentile25, plan.percentile75]) ?? null;
  }

  override getBarValue(plan: CsaDatum): number {
    return plan.percentile75;
  }

  override getSortOrder(a: CsaDatum, b: CsaDatum): number {
    const order = ['Rural', 'Small', 'Medium', 'Large', 'Other'];
    return order.indexOf(a.size) - order.indexOf(b.size);
  }

  override getYDimension(plan: CsaDatum): string {
    return plan.size;
  }
}
