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
import { MlbCountyDatum } from '../mlb-county-plot.component';
import { MlbCountyPlotStackedBarsComponent } from './mlb-county-plot-stacked-bars/mlb-county-plot-stacked-bars.component';

@Component({
  selector: 'app-mlb-county-plot-dot-plot',
  standalone: true,
  imports: [VicChartModule, VicXyAxisModule, MlbCountyPlotStackedBarsComponent],
  providers: [
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicChartConfigBuilder,
    CaDotPlotService,
  ],
  templateUrl: './mlb-county-plot-dot-plot.component.html',
  styleUrl: './mlb-county-plot-dot-plot.component.scss',
})
export class MlbCountyPlotDotPlotComponent implements OnChanges {
  @Input() data: MlbCountyDatum[];

  constructor(public caDotPlotService: CaDotPlotService) {}

  ngOnChanges(): void {
    if (this.data[0]) {
      const dotPlotDataConfig: DotPlotDataConfig = {
        data: this.data,
        yDimension: 'county',
        isMlb: true,
      };
      this.caDotPlotService.onChanges(dotPlotDataConfig);
      this.caDotPlotService.setProperties(this.getSortOrder.bind(this));
      this.caDotPlotService.setHeight(dotPlotDataConfig.yDimension);
    }
  }

  getSortOrder(a: MlbCountyDatum, b: MlbCountyDatum): number {
    let sort = a.range - b.range;
    if (a.directionality.toLowerCase().includes('higher')) {
      sort = b.range - a.range;
    }
    return sort;
  }
}
