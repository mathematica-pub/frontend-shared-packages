import { Component, Input, OnChanges } from '@angular/core';
import {
  VicChartConfigBuilder,
  VicChartModule,
  VicStackedBarsConfigBuilder,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYOrdinalAxisConfigBuilder,
} from '@hsi/viz-components';
import {
  CaDotPlotService,
  DotPlotDataConfig,
} from '../../../ca/ca-dot-plot.service';
import { raceCategories } from '../../../ca/ca.constants';
import { BdaDatum } from '../bda.component';
import { BdaStackedBarsComponent } from './bda-stacked-bars/bda-stacked-bars.component';

@Component({
  selector: 'app-bda-dot-plot',
  standalone: true,
  imports: [VicChartModule, VicXyAxisModule, BdaStackedBarsComponent],
  providers: [
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicChartConfigBuilder,
    CaDotPlotService,
  ],
  templateUrl: './bda-dot-plot.component.html',
  styleUrl: './bda-dot-plot.component.scss',
})
export class BdaDotPlotComponent implements OnChanges {
  @Input() data: BdaDatum[];
  labelWidth = 140;
  bandwidth = 26;
  categories = raceCategories;

  constructor(public caDotPlotService: CaDotPlotService) {}

  ngOnChanges(): void {
    if (this.data[0]) {
      const dotPlotDataConfig: DotPlotDataConfig = {
        data: this.data,
        yDimension: 'stratVal',
        getCurrentRollup: this.getCurrentRollup.bind(this),
        labelWidth: this.labelWidth,
        bandwidth: this.bandwidth,
      };
      this.caDotPlotService.onChanges(dotPlotDataConfig);
      this.injectMissingCategories();
      this.caDotPlotService.setProperties(this.getSortOrder.bind(this));
      this.caDotPlotService.setHeight(dotPlotDataConfig.yDimension);
    }
  }

  getCurrentRollup(x: BdaDatum, plan: BdaDatum): boolean {
    return x.stratVal === plan.stratVal && x.strat === plan.strat;
  }

  getSortOrder(a: BdaDatum, b: BdaDatum): number {
    const order = structuredClone(this.categories);
    this.caDotPlotService.setRaceEthnicityMockCategories(order);

    const stratA = a.strat.toLowerCase() === 'ethnicity' ? 'ethnicity' : 'race';
    const stratB = b.strat.toLowerCase() === 'ethnicity' ? 'ethnicity' : 'race';
    return order[stratA][a.stratVal] - order[stratB][b.stratVal];
  }

  injectMissingCategories(): void {
    Object.keys(this.categories).forEach((strat) => {
      Object.keys(this.categories[strat]).forEach((stratVal) => {
        const categoryData = this.caDotPlotService.getCategoryData(
          strat,
          stratVal
        );

        if (categoryData.length === 0) {
          const matchingStrat = this.caDotPlotService.getMatchingStrat(strat);
          if (matchingStrat) {
            const emptyCategory: BdaDatum = {
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
              strat: matchingStrat.strat,
              stratVal: stratVal,
              units: null,
              value: null,
            };
            this.caDotPlotService.addCategory(emptyCategory);
          }
        }
      });
    });
  }
}
