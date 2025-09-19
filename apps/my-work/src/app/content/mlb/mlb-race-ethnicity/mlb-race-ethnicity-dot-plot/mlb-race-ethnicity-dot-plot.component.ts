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
import { MlbRaceDatum } from '../mlb-race-ethnicity.component';
import { MlbRaceEthnicityStackedBarsComponent } from './mlb-race-ethnicity-stacked-bars/mlb-race-ethnicity-stacked-bars.component';

@Component({
  selector: 'app-mlb-race-ethnicity-dot-plot',
  standalone: true,
  imports: [
    VicChartModule,
    VicXyAxisModule,
    MlbRaceEthnicityStackedBarsComponent,
  ],
  providers: [
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicChartConfigBuilder,
    CaDotPlotService,
  ],
  templateUrl: './mlb-race-ethnicity-dot-plot.component.html',
  styleUrl: './mlb-race-ethnicity-dot-plot.component.scss',
})
export class MlbRaceEthnicityDotPlotComponent implements OnChanges {
  @Input() data: MlbRaceDatum[];
  categories = raceCategories;

  constructor(public caDotPlotService: CaDotPlotService) {}

  ngOnChanges(): void {
    if (this.data[0]) {
      const dotPlotDataConfig: DotPlotDataConfig = {
        data: this.data,
        yDimension: 'stratVal',
        isMlb: true,
        bandwidth: 26,
        labelWidth: this.data[0].strat.includes('shortage') ? 170 : 140,
      };
      this.caDotPlotService.onChanges(dotPlotDataConfig);
      this.injectMissingCategories();
      this.caDotPlotService.setExtents();
      this.caDotPlotService.setProperties(this.getSortOrder.bind(this));
      this.caDotPlotService.setHeight(dotPlotDataConfig.yDimension);
    }
  }

  getSortOrder(a: MlbRaceDatum, b: MlbRaceDatum): number {
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
            const emptyCategory: MlbRaceDatum = {
              directionality: null,
              measureCode: null,
              series: 'percentile',
              strat: matchingStrat.strat,
              stratVal: stratVal,
              units: null,
              value: null,
              lob: null,
              comparison: false,
              average: null,
            };
            this.caDotPlotService.addCategory(emptyCategory);
          }
        }
      });
    });
  }
}
