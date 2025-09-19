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
import { CsaDatum } from '../csa.component';
import { CsaStackedBarsComponent } from './csa-stacked-bars/csa-stacked-bars.component';

@Component({
  selector: 'app-csa-dot-plot',
  standalone: true,
  imports: [VicChartModule, VicXyAxisModule, CsaStackedBarsComponent],
  providers: [
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    CaDotPlotService,
  ],
  templateUrl: './csa-dot-plot.component.html',
  styleUrl: './csa-dot-plot.component.scss',
})
export class CsaDotPlotComponent implements OnChanges {
  @Input() data: CsaDatum[];
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

  getCurrentRollup(x: CsaDatum, plan: CsaDatum): boolean {
    return x.size === plan.size;
  }

  getSortOrder(a: CsaDatum, b: CsaDatum): number {
    return this.categories.indexOf(a.size) - this.categories.indexOf(b.size);
  }

  injectMissingCategories(): void {
    const categories = structuredClone(this.categories);
    categories.pop();
    categories.forEach((strat) => {
      const categoryData = this.caDotPlotService.rollupData.filter(
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
        this.caDotPlotService.addCategory(emptyCategory);
      }
    });
  }
}
