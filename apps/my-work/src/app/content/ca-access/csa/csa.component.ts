/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { VicChartConfigBuilder } from '@hsi/viz-components';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { CaStackedBarsService } from '../../ca/ca-stacked-bars.service';
import { CaDatum } from '../ca-access-stacked-bars.component';
import { dataPath } from '../data-paths.constants';
import { CsaDotPlotComponent } from './csa-dot-plot/csa-dot-plot.component';

export interface CsaDatum extends CaDatum {
  size: string;
  percentile25: number;
  percentile75: number;
}

@Component({
  selector: 'app-csa',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    CsaDotPlotComponent,
    ReactiveFormsModule,
  ],
  providers: [VicChartConfigBuilder, CaChartService, CaStackedBarsService],
  templateUrl: './csa.component.html',
  styleUrl: './csa.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CsaComponent implements OnInit {
  dataPath = dataPath.csa;
  filters = {
    delivSyss: [],
    measureCodes: [],
    stratVals: [],
  };
  filterTypes = ['delivSys', 'measureCode', 'stratVal'];

  constructor(public caChartService: CaChartService) {}

  ngOnInit(): void {
    const caChartDataConfig: CaChartDataConfig = {
      filters: this.filters,
      filterTypes: this.filterTypes,
      dataPath: this.dataPath,
      getTransformedData: this.getTransformedData.bind(this),
    };
    this.caChartService.init(caChartDataConfig);
  }

  getTransformedData(data: CsaDatum[]): CsaDatum[] {
    const transformed: CsaDatum[] = data.map((x: any) => {
      const obj: CsaDatum = {
        series: 'percentile',
        size: x.County_Size,
        measureCode: x.Measure_Code,
        stratVal: x.StratVal,
        delivSys: x.DelivSys,
        units: x.Units,
        value:
          x.CSA_25 && !isNaN(x.CSA_25) && x.CSA_75 && !isNaN(x.CSA_75)
            ? Math.abs(x.CSA_75 - x.CSA_25)
            : null,
        planValue: x.Value && !isNaN(x.Value) ? +x.Value : null,
        percentile25: x.CSA_25 && !isNaN(x.CSA_25) ? +x.CSA_25 : null,
        percentile75: x.CSA_75 && !isNaN(x.CSA_75) ? +x.CSA_75 : null,
        compVal: x.CSA_CompVal && !isNaN(x.CSA_CompVal) ? +x.CSA_CompVal : null,
        compValDesc: x.CSA_CompVal_Desc,
        directionality: x.Directionality,
        pctBelowComp:
          x.CSA_PctBelowComp && !isNaN(x.CSA_PctBelowComp)
            ? +x.CSA_PctBelowComp
            : null,
        plans: [],
      };
      return obj;
    });
    return transformed;
  }
}
