import { Component, Input, OnChanges } from '@angular/core';
import {
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
import { sizeCategories } from '../../ca-access.constants';
import { CsaRaceDatum } from '../csa-race.component';
import { CsaRaceStackedBarsComponent } from './csa-race-stacked-bars/csa-race-stacked-bars.component';

@Component({
  selector: 'app-csa-race-dot-plot',
  standalone: true,
  imports: [VicChartModule, VicXyAxisModule, CsaRaceStackedBarsComponent],
  providers: [
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    CaDotPlotService,
  ],
  templateUrl: './csa-race-dot-plot.component.html',
  styleUrl: './csa-race-dot-plot.component.scss',
})
export class CsaRaceDotPlotComponent implements OnChanges {
  @Input() data: CsaRaceDatum[];
  categories = sizeCategories;

  constructor(public caDotPlotService: CaDotPlotService) {}

  ngOnChanges(): void {
    if (this.data[0]) {
      const dotPlotDataConfig: DotPlotDataConfig = {
        data: this.data,
        yDimension: 'size',
        isPercentile: true,
        getCurrentRollup: this.getCurrentRollup.bind(this),
      };
      this.caDotPlotService.onChanges(dotPlotDataConfig);
      this.injectMissingCategories();
      this.caDotPlotService.setProperties(this.getSortOrder.bind(this));
    }
  }

  getCurrentRollup(x: CsaRaceDatum, plan: CsaRaceDatum): boolean {
    return x.size === plan.size;
  }

  getSortOrder(a: CsaRaceDatum, b: CsaRaceDatum): number {
    return this.categories.indexOf(a.size) - this.categories.indexOf(b.size);
  }

  injectMissingCategories(): void {
    const categories = structuredClone(this.categories);
    categories.pop();
    categories.forEach((strat) => {
      const categoryData = this.caDotPlotService.rollupData.filter(
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
        this.caDotPlotService.addCategory(emptyCategory);
      }
    });
  }
}
