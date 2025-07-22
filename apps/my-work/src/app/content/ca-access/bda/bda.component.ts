/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartDataConfig, CaChartService } from '../../ca/ca-chart.service';
import { CaStackedBarsService } from '../../ca/ca-stacked-bars.service';
import { dataPath } from '../../ca/data-paths.constants';
import { CaDatum } from '../ca-access-stacked-bars.component';
import { BdaDotPlotComponent } from './bda-dot-plot/bda-dot-plot.component';

export interface BdaDatum extends CaDatum {
  goal: number;
  strat: string;
}

@Component({
  selector: 'app-bda',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    ReactiveFormsModule,
    BdaDotPlotComponent,
  ],
  providers: [CaChartService, CaStackedBarsService],
  templateUrl: 'bda.component.html',
  styleUrl: './bda.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BdaComponent implements OnInit {
  dataPath = dataPath.bda;
  filters = {
    measureCodes: [],
    delivSyss: [],
  };
  filterTypes = ['delivSys', 'measureCode'];

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

  getTransformedData(data: BdaDatum[]): BdaDatum[] {
    const transformed: BdaDatum[] = data.map((x: any) => {
      const obj: BdaDatum = {
        series: 'percentile',
        measureCode: x.Measure_Code,
        delivSys: x.DelivSys,
        units: x.Units,
        value: x.BDA_Goal && !isNaN(x.BDA_Goal) ? +x.BDA_Goal : null,
        planValue: x.Value && !isNaN(x.Value) ? +x.Value : null,
        compVal: x.BDA_CompVal && !isNaN(x.BDA_CompVal) ? +x.BDA_CompVal : null,
        compValDesc: x.BDA_CompVal_Desc,
        directionality: x.Directionality,
        pctBelowComp:
          x.BDA_PctBelowGoal && !isNaN(x.BDA_PctBelowGoal)
            ? +x.BDA_PctBelowGoal
            : null,
        goal: x.BDA_Goal && !isNaN(x.BDA_Goal) ? +x.BDA_Goal : null,
        strat: x.STRAT,
        stratVal: x.StratVal_v2,
        plans: [],
      };
      return obj;
    });
    return transformed;
  }
}
