import { Component, Input, OnChanges } from '@angular/core';
import {
  VicChartModule,
  VicStackedBarsConfigBuilder,
  VicXOrdinalAxisConfigBuilder,
  VicXyAxisModule,
  VicYQuantitativeAxisConfigBuilder,
} from '@mathstack/viz';
import { CaStackedBarsService } from '../../../ca/ca-stacked-bars.service';
import {
  TrendedDotPlotDataConfig,
  TrendedDotPlotService,
} from '../../../ca/trended-dot-plot.service';
import { FinalPercentilesDatum } from '../final-percentiles.component';
import { FinalPercentilesStackedBarsComponent } from './final-percentiles-stacked-bars/final-percentiles-stacked-bars.component';

@Component({
  selector: 'app-final-percentiles-dot-plot',
  standalone: true,
  imports: [
    VicChartModule,
    VicXyAxisModule,
    FinalPercentilesStackedBarsComponent,
  ],
  providers: [
    VicStackedBarsConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicXOrdinalAxisConfigBuilder,
    TrendedDotPlotService,
    CaStackedBarsService,
  ],
  templateUrl: './final-percentiles-dot-plot.component.html',
})
export class FinalPercentilesDotPlotComponent implements OnChanges {
  @Input() data: FinalPercentilesDatum[];

  constructor(public trendedDotPlotService: TrendedDotPlotService) {}

  ngOnChanges(): void {
    if (this.data[0]) {
      const dotPlotDataConfig: TrendedDotPlotDataConfig = {
        data: this.data,
        xDimension: 'year',
      };
      this.trendedDotPlotService.onChanges(dotPlotDataConfig);
      this.trendedDotPlotService.setProperties(this.getSortOrder.bind(this));
    }
  }

  getSortOrder(a: FinalPercentilesDatum, b: FinalPercentilesDatum): number {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }
}
