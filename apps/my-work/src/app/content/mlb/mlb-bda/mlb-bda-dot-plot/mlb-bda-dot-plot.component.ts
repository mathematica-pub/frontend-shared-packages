import { CommonModule } from '@angular/common';
import { Component, OnChanges } from '@angular/core';
import {
  VicBarsConfigBuilder,
  VicBarsModule,
  VicChartConfigBuilder,
  VicChartModule,
  VicStackedBarsConfigBuilder,
  VicStackedBarsModule,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYOrdinalAxisConfigBuilder,
} from '@hsi/viz-components';
import { MlbDotPlotComponent } from '../../mlb-dot-plot.component';
import { MlbBdaDatum } from '../mlb-bda.component';
import { MlbBdaStackedBarsComponent } from './mlb-bda-stacked-bars/mlb-bda-stacked-bars.component';

@Component({
  selector: 'app-mlb-bda-dot-plot',
  standalone: true,
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicStackedBarsModule,
    VicXyAxisModule,
    MlbBdaStackedBarsComponent,
  ],
  providers: [
    VicBarsConfigBuilder,
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicChartConfigBuilder,
  ],
  templateUrl: './mlb-bda-dot-plot.component.html',
  styleUrl: './mlb-bda-dot-plot.component.scss',
})
export class MlbBdaDotPlotComponent
  extends MlbDotPlotComponent
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
      this.setHeight();
    }
  }

  override getCurrentRollup(x: MlbBdaDatum, plan: MlbBdaDatum): boolean {
    return x.stratVal === plan.stratVal && x.strat === plan.strat;
  }

  override getInvisibleStackValue(plan: MlbBdaDatum): number {
    return plan.value;
  }

  override getBarValue(plan: MlbBdaDatum): number {
    return plan.value;
  }

  override getSortOrder(a: MlbBdaDatum, b: MlbBdaDatum): number {
    const order = structuredClone(this.categories);
    // account for mock categories
    order.race['Race 1 covers two lines'] = 0;
    order.race['Race 2'] = 1;
    order.race['Race 3 covers two lines'] = 2;
    order.race[`Race 4 covers three lines because it's long`] = 3;
    order.race['Race 5'] = 4;
    order.race['No Race Selection and Race 1 or Race 2 Ethnicity'] = 5;
    order.race['Some Other Race'] = 6;
    order.race['Two or More Races'] = 7;
    order.ethnicity['Ethnicity 1 covers two lines'] = 9;
    order.ethnicity['Ethnicity 2 covers two lines'] = 10;

    const stratA = a.strat.toLowerCase() === 'ethnicity' ? 'ethnicity' : 'race';
    const stratB = b.strat.toLowerCase() === 'ethnicity' ? 'ethnicity' : 'race';
    return order[stratA][a.stratVal] - order[stratB][b.stratVal];
  }

  override getYDimension(plan: MlbBdaDatum): string {
    return plan.stratVal;
  }

  injectMissingCategories(): void {
    Object.keys(this.categories).forEach((strat) => {
      Object.keys(this.categories[strat]).forEach((stratVal) => {
        const categoryData = (this.rollupData as MlbBdaDatum[]).filter(
          (category) =>
            (category as MlbBdaDatum).strat.toLowerCase().includes(strat) &&
            category.stratVal === stratVal
        );

        if (categoryData.length === 0) {
          const matchingStrat = (this.rollupData as MlbBdaDatum[]).find(
            (category) => category.strat.toLowerCase() === strat
          );
          if (matchingStrat) {
            const emptyCategory: MlbBdaDatum = {
              directionality: null,
              measureCode: null,
              series: 'percentile',
              strat: matchingStrat.strat,
              stratVal: stratVal,
              units: null,
              value: null,
              lob: null,
              average: null,
            };
            const invisibleCategory = structuredClone(emptyCategory);
            invisibleCategory.series = 'invisible';

            this.rollupData.push(...[emptyCategory, invisibleCategory]);
          }
        }
      });
    });
  }

  setHeight(): void {
    const uniqueStratVals = this.rollupData.reduce((set, d) => {
      set.add(d.series + d.stratVal);
      return set;
    }, new Set());
    this.chartConfig.height = uniqueStratVals.size * this.bandwidth;
  }
}
