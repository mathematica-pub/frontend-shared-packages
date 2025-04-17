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
import { CsaDatum } from '../csa.component';
import { CsaStackedBarsComponent } from './csa-stacked-bars/csa-stacked-bars.component';

@Component({
  selector: 'app-csa-dot-plot',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicStackedBarsModule,
    VicXyAxisModule,
    CsaStackedBarsComponent,
  ],
  providers: [
    VicBarsConfigBuilder,
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
  ],
  templateUrl: './csa-dot-plot.component.html',
  styleUrl: './csa-dot-plot.component.scss',
})
export class CsaDotPlotComponent
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

  override getCurrentRollup(x: CsaDatum, plan: CsaDatum): boolean {
    return x.size === plan.size;
  }

  override getInvisibleStackValue(plan: CsaDatum): number {
    return min([plan.percentile25, plan.percentile75]) ?? null;
  }

  override getBarValue(plan: CsaDatum): number {
    return plan.percentile75;
  }

  override getGoalValue(): number {
    return (this.data[0] as CsaDatum).compVal;
  }

  override getSortOrder(a: CsaDatum, b: CsaDatum): number {
    return this.categories.indexOf(a.size) - this.categories.indexOf(b.size);
  }

  override getYDimension(plan: CsaDatum): string {
    return plan.size;
  }

  injectMissingCategories(): void {
    const categories = structuredClone(this.categories);
    categories.pop();
    categories.forEach((strat) => {
      const categoryData = this.rollupData.filter(
        (category) => (category as CsaDatum).size === strat
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
        } as CsaDatum;
        const invisibleCategory = structuredClone(emptyCategory);
        invisibleCategory.series = 'invisible';

        this.rollupData.push(...[emptyCategory, invisibleCategory]);
      }
    });
  }
}
