import { Component, Input, OnChanges } from '@angular/core';
import {
  VicChartConfigBuilder,
  VicChartModule,
  VicStackedBarsConfigBuilder,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYOrdinalAxisConfigBuilder,
} from '@hsi/viz-components';
import { max, min } from 'd3';
import {
  CaDotPlotService,
  DotPlotDataConfig,
} from '../../../ca/ca-dot-plot.service';
import { lobNames } from '../../mlb.constants';
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
        labelWidth: 130,
      };
      this.caDotPlotService.onChanges(dotPlotDataConfig);
      this.caDotPlotService.setProperties(this.getSortOrder.bind(this));
      this.caDotPlotService.setHeight(dotPlotDataConfig.yDimension);
    }
  }

  getSortOrder(a: MlbCountyDatum, b: MlbCountyDatum): number {
    const aRow = this.data.filter((lob) => lob.county === a.county);
    const bRow = this.data.filter((lob) => lob.county === b.county);
    const aState = aRow.find(
      (lob) => lob.lob === lobNames.mock || lob.lob === lobNames.real
    );
    const bState = bRow.find(
      (lob) => lob.lob === lobNames.mock || lob.lob === lobNames.real
    );
    const isAMin = aState.average === min(aRow.map((lob) => lob.average));
    const isBMin = bState.average === min(bRow.map((lob) => lob.average));
    const isAMax = aState.average === max(aRow.map((lob) => lob.average));
    const isBMax = bState.average === max(bRow.map((lob) => lob.average));
    let sort = 0;
    if ((isAMax && !isBMax) || (isBMin && !isAMin)) {
      sort = -1;
    } else if ((isBMax && !isAMax) || (isAMin && !isBMin)) {
      sort = 1;
    } else if (a.county.localeCompare(b.county) < 0) {
      sort = -1;
    } else if (a.county.localeCompare(b.county) > 0) {
      sort = 1;
    }
    return sort;
  }
}
