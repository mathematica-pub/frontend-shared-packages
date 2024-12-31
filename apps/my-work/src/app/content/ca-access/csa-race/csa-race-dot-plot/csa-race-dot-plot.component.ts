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
import { CsaDatum } from '../csa-race.component';
import { CsaRaceStackedBarsComponent } from './csa-race-stacked-bars/csa-race-stacked-bars.component';

@Component({
  selector: 'app-csa-race-dot-plot',
  standalone: true,
  imports: [
    CommonModule,
    VicXyChartModule,
    VicBarsModule,
    VicStackedBarsModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    CsaRaceStackedBarsComponent,
  ],
  providers: [
    VicBarsConfigBuilder,
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
  ],
  templateUrl: './csa-race-dot-plot.component.html',
  styleUrl: './csa-race-dot-plot.component.scss',
})
export class CsaRaceDotPlotComponent extends CaAccessDotPlotComponent {
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
