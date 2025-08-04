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
import { MlbBdaDatum } from '../mlb-bda.component';
import { MlbBdaStackedBarsComponent } from './mlb-bda-stacked-bars/mlb-bda-stacked-bars.component';

@Component({
  selector: 'app-mlb-bda-dot-plot',
  standalone: true,
  imports: [VicChartModule, VicXyAxisModule, MlbBdaStackedBarsComponent],
  providers: [
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicChartConfigBuilder,
    CaDotPlotService,
  ],
  templateUrl: './mlb-bda-dot-plot.component.html',
  styleUrl: './mlb-bda-dot-plot.component.scss',
})
export class MlbBdaDotPlotComponent implements OnChanges {
  @Input() data: MlbBdaDatum[];
  categories = raceCategories;

  constructor(public caDotPlotService: CaDotPlotService) {}

  ngOnChanges(): void {
    if (this.data[0]) {
      const dotPlotDataConfig: DotPlotDataConfig = {
        data: this.data,
        yDimension: 'stratVal',
        isMlb: true,
        bandwidth: 26,
        labelWidth: 140,
      };
      this.caDotPlotService.onChanges(dotPlotDataConfig);
      this.injectMissingCategories();
      this.caDotPlotService.setExtents();
      this.caDotPlotService.setProperties(this.getSortOrder.bind(this));
      this.caDotPlotService.setHeight(dotPlotDataConfig.yDimension);
    }
  }

  getSortOrder(a: MlbBdaDatum, b: MlbBdaDatum): number {
    const order = structuredClone(this.categories);
    this.caDotPlotService.setBdaMockCategories(order);

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
            const emptyCategory: MlbBdaDatum = {
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
