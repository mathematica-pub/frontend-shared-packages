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
export class BdaDotPlotComponent extends CaAccessDotPlotComponent {
  override labelWidth = 140;
  override bandwidth = 26;

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
    const order = {
      race: {
        // data
        'American Indian or Alaska Native': 0,
        Asian: 1,
        'Black or African American': 2,
        'Native Hawaiian or Other Pacific Islander': 3,
        White: 4,
        'No Race Selection and Hispanic or Latino Ethnicity': 5,
        // mock
        'Race 1 covers two lines': 0,
        'Race 2': 1,
        'Race 3 covers two lines': 2,
        [`Race 4 covers three lines because it's long`]: 3,
        'Race 5': 4,
        'No Race Selection and Race 1 or Race 2 Ethnicity': 5,
        // both
        'Some Other Race': 6,
        'Two or More Races': 7,
        'Asked But No Answer/Unknown': 8,
      },
      ethnicity: {
        // data
        'Hispanic or Latino': 9,
        'Not Hispanic or Latino': 10,
        // mock
        'Ethnicity 1 covers two lines': 9,
        'Ethnicity 2 covers two lines': 10,
        // both
        'Asked But No Answer/Unknown': 11,
      },
    };

    const stratA = a.strat.toLowerCase() === 'ethnicity' ? 'ethnicity' : 'race';
    const stratB = b.strat.toLowerCase() === 'ethnicity' ? 'ethnicity' : 'race';
    return order[stratA][a.stratVal] - order[stratB][b.stratVal];
  }

  override getYDimension(plan: BdaDatum): string {
    return plan.stratVal;
  }
}
