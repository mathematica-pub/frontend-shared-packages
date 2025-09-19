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
import { CaStackedBarsService } from '../../../ca/ca-stacked-bars.service';
import { MlbPercentilesDatum } from '../mlb-percentiles.component';
import { MlbPercentilesStackedBarsComponent } from './mlb-percentiles-stacked-bars/mlb-percentiles-stacked-bars.component';

@Component({
  selector: 'app-mlb-percentiles-dot-plot',
  standalone: true,
  imports: [
    VicChartModule,
    VicXyAxisModule,
    MlbPercentilesStackedBarsComponent,
  ],
  providers: [
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    CaDotPlotService,
    CaStackedBarsService,
  ],
  templateUrl: './mlb-percentiles-dot-plot.component.html',
  styleUrl: './mlb-percentiles-dot-plot.component.scss',
})
export class MlbPercentilesDotPlotComponent implements OnChanges {
  @Input() data: MlbPercentilesDatum[];

  constructor(public caDotPlotService: CaDotPlotService) {}

  ngOnChanges(): void {
    if (this.data[0]) {
      const dotPlotDataConfig: DotPlotDataConfig = {
        data: this.data,
        yDimension: 'lob',
        isPercentile: true,
        isMlb: true,
      };
      this.caDotPlotService.onChanges(dotPlotDataConfig);
      this.caDotPlotService.setProperties(this.getSortOrder.bind(this));
    }
  }

  getSortOrder(a: MlbPercentilesDatum, b: MlbPercentilesDatum): number {
    const lowerA = a.lob.toLowerCase();
    const lowerB = b.lob.toLowerCase();

    if (lowerA < lowerB) {
      return -1;
    }
    if (lowerA > lowerB) {
      return 1;
    }
    return 0;
  }
}
