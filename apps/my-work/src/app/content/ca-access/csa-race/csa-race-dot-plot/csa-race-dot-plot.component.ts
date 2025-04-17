import { CommonModule } from '@angular/common';
import { Component, OnChanges } from '@angular/core';
import {
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartModule,
  VicStackedBarsConfigBuilder,
  VicStackedBarsModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYOrdinalAxisConfigBuilder,
} from '@hsi/viz-components';
import { min } from 'd3';
import { CaAccessDotPlotComponent } from '../../ca-access-dot-plot.component';
import { CsaRaceDatum } from '../csa-race.component';
import { CsaRaceStackedBarsComponent } from './csa-race-stacked-bars/csa-race-stacked-bars.component';

@Component({
  selector: 'app-csa-race-dot-plot',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicStackedBarsModule,
    VicXyAxisModule,
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
export class CsaRaceDotPlotComponent
  extends CaAccessDotPlotComponent
  implements OnChanges
{
  categories = ['Rural', 'Small', 'Medium', 'Large', 'Other'];

  override ngOnChanges(): void {
    if (this.data[0]) {
      console.log('this.data after changes', this.data);
      this.setData();
      this.injectMissingCategories();
      this.setProperties();
    }
  }

  override getCurrentRollup(x: CsaRaceDatum, plan: CsaRaceDatum): boolean {
    return x.size === plan.size;
  }

  override getInvisibleStackValue(plan: CsaRaceDatum): number {
    return min([plan.percentile25, plan.percentile75]) ?? null;
  }

  override getBarValue(plan: CsaRaceDatum): number {
    return plan.percentile75;
  }

  override getGoalValue(): number {
    return (
      this.data.find((category) => category.compVal !== null) as CsaRaceDatum
    ).compVal;
  }

  override getSortOrder(a: CsaRaceDatum, b: CsaRaceDatum): number {
    const order = ['Rural', 'Small', 'Medium', 'Large', 'Other'];
    return order.indexOf(a.size) - order.indexOf(b.size);
  }

  override getYDimension(plan: CsaRaceDatum): string {
    return plan.size;
  }

  injectMissingCategories(): void {
    const categories = structuredClone(this.categories);
    categories.pop();
    categories.forEach((strat) => {
      const categoryData = this.rollupData.filter(
        (category) => (category as CsaRaceDatum).size === strat
      );

      if (categoryData.length === 0) {
        const emptyCategory = {
          compVal: null,
          compValDesc: '',
          delivSys: null,
          directionality: null,
          measureCode: null,
          pctBelowComp: null,
          planValue: null,
          plans: [],
          series: 'percentile',
          stratVal: null,
          units: null,
          value: null,
          size: strat,
          percentile25: null,
          percentile75: null,
        } as CsaRaceDatum;
        const invisibleCategory = structuredClone(emptyCategory);
        invisibleCategory.series = 'invisible';

        this.rollupData.push(...[emptyCategory, invisibleCategory]);
      }
    });
  }
}
