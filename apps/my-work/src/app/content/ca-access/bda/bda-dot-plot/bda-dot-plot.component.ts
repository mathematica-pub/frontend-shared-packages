import { CommonModule } from '@angular/common';
import { Component, OnChanges } from '@angular/core';
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
import { CaAccessDotPlotComponent } from '../../ca-access-dot-plot.component';
import { BdaDatum } from '../bda.component';
import { BdaStackedBarsComponent } from './bda-stacked-bars/bda-stacked-bars.component';

@Component({
  selector: 'app-bda-dot-plot',
  standalone: true,
  imports: [
    CommonModule,
    VicXyChartModule,
    VicBarsModule,
    VicStackedBarsModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    BdaStackedBarsComponent,
  ],
  providers: [
    VicBarsConfigBuilder,
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
  ],
  templateUrl: './bda-dot-plot.component.html',
  styleUrl: './bda-dot-plot.component.scss',
})
export class BdaDotPlotComponent
  extends CaAccessDotPlotComponent
  implements OnChanges
{
  override labelWidth = 140;
  override bandwidth = 26;
  categories = {
    race: {
      'American Indian or Alaska Native': 0,
      Asian: 1,
      'Black or African American': 2,
      'Native Hawaiian or Other Pacific Islander': 3,
      White: 4,
      'No Race Selection and Hispanic or Latino Ethnicity': 5,
      'Some Other Race': 6,
      'Two or More Races': 7,
      'Asked But No Answer/Unknown': 8,
    },
    ethnicity: {
      'Hispanic or Latino': 9,
      'Not Hispanic or Latino': 10,
      'Asked But No Answer/Unknown': 11,
    },
  };

  override ngOnChanges(): void {
    if (this.data[0]) {
      console.log('this.data after changes', this.data);
      this.setData();
      this.injectMissingCategories();
      this.setProperties();
      this.chartHeight = this.rollupData.length * this.bandwidth;
    }
  }

  override getCurrentRollup(x: BdaDatum, plan: BdaDatum): boolean {
    return x.stratVal === plan.stratVal && x.strat === plan.strat;
  }

  override getInvisibleStackValue(plan: BdaDatum): number {
    return plan.value;
  }

  override getBarValue(plan: BdaDatum): number {
    return plan.value;
  }

  override getSortOrder(a: BdaDatum, b: BdaDatum): number {
    const order = structuredClone(this.categories);
    // account for mock categories
    order.race['Race 1 covers two lines'] = 0;
    order.race['Race 2'] = 1;
    order.race['Race 3 covers two lines'] = 2;
    order.race[`Race 4 covers three lines because it's long`] = 3;
    order.race['Race 5'] = 4;
    order.race['No Race Selection and Race 1 or Race 2 Ethnicity'] = 5;
    order.ethnicity['Ethnicity 1 covers two lines'] = 9;
    order.ethnicity['Ethnicity 2 covers two lines'] = 10;

    const stratA = a.strat.toLowerCase() === 'ethnicity' ? 'ethnicity' : 'race';
    const stratB = b.strat.toLowerCase() === 'ethnicity' ? 'ethnicity' : 'race';
    return order[stratA][a.stratVal] - order[stratB][b.stratVal];
  }

  override getYDimension(plan: BdaDatum): string {
    return plan.stratVal;
  }

  injectMissingCategories(): void {
    Object.keys(this.categories).forEach((strat) => {
      Object.keys(this.categories[strat]).forEach((stratVal) => {
        const categoryData = (this.rollupData as BdaDatum[]).filter(
          (category) =>
            (category as BdaDatum).strat.toLowerCase().includes(strat) &&
            category.stratVal === stratVal
        );

        if (categoryData.length === 0) {
          const stratText = (this.rollupData as BdaDatum[]).find((category) =>
            category.strat.toLowerCase().includes(strat)
          ).strat;

          const emptyCategory = {
            compVal: null,
            compValDesc: null,
            delivSys: null,
            directionality: null,
            goal: null,
            measureCode: null,
            pctBelowComp: null,
            planValue: null,
            plans: [],
            series: 'percentile',
            strat: stratText,
            stratVal: stratVal,
            units: null,
            value: null,
          } as BdaDatum;
          const invisibleCategory = structuredClone(emptyCategory);
          invisibleCategory.series = 'invisible';

          this.rollupData.push(...[emptyCategory, invisibleCategory]);
        }
      });
    });
  }
}
